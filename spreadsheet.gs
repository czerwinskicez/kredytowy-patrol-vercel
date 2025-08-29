// Ustawia próg czasowy w milisekundach. Skrypt nie wyśle żądania częściej niż raz na ten okres.
// 60000 ms = 1 minuta
var THROTTLE_TIMEOUT_MS = 60000;

/**
 * Ta funkcja jest automatycznie wywoływana przez trigger przy każdej edycji arkusza.
 * Zawiera mechanizm throttlingu, aby uniknąć nadmiernego wysyłania żądań do API.
 */
function onEdit(e) {
  var lock = LockService.getScriptLock();
  // Czekaj maksymalnie 10 sekund na zwolnienie blokady przez inny proces
  if (!lock.tryLock(10000)) {
    Logger.log('Could not acquire lock. Another onEdit trigger is likely running.');
    return;
  }

  try {
    var scriptProperties = PropertiesService.getScriptProperties();
    var lastExecutionTime = parseInt(scriptProperties.getProperty('lastOnEditExecutionTime') || '0');
    var now = new Date().getTime();

    // Sprawdź, czy od ostatniego udanego wysłania minęło wystarczająco dużo czasu
    if (now - lastExecutionTime < THROTTLE_TIMEOUT_MS) {
      Logger.log('Throttled: Less than ' + (THROTTLE_TIMEOUT_MS / 1000) + 's has passed. Skipping.');
      return;
    }

    var sheetName = e.source.getActiveSheet().getName();
    var secret = scriptProperties.getProperty('REVALIDATE_SECRET');

    if (!secret) {
      Logger.log('ERROR: REVALIDATE_SECRET is not set in Script Properties. Aborting.');
      SpreadsheetApp.getActiveSpreadsheet().toast('Błąd: Sekret rewalidacji nie jest ustawiony!', 'Błąd krytyczny', 5);
      return;
    }
    
    var url = 'https://kredytowypatrol.pl/api/revalidate?secret=' + secret;
    var payload = { 'sheetName': sheetName };
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    };

    UrlFetchApp.fetch(url, options);
    Logger.log('Successfully sent revalidation request for sheet: ' + sheetName);
    // Zapisz czas ostatniego udanego wysłania, aby throttling mógł działać
    scriptProperties.setProperty('lastOnEditExecutionTime', now.toString());

  } catch (error) {
    Logger.log('Error sending revalidation request: ' + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast('Błąd podczas wysyłania rewalidacji!', 'Błąd', 5);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Funkcja do ręcznego wyzwalania pełnej rewalidacji wszystkich danych.
 * Można ją uruchomić ręcznie z edytora skryptów lub dodać do menu w arkuszu.
 */
function onManualRefresh() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var secret = scriptProperties.getProperty('REVALIDATE_SECRET');

  if (!secret) {
    Logger.log('ERROR: REVALIDATE_SECRET is not set in Script Properties. Aborting.');
    SpreadsheetApp.getActiveSpreadsheet().toast('Błąd: Sekret rewalidacji nie jest ustawiony!', 'Błąd krytyczny', 5);
    return;
  }

  var url = 'https://kredytowypatrol.pl/api/revalidate?secret=' + secret;
  var payload = { 'sheetName': 'ALL' };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(url, options);
    Logger.log('Successfully sent manual refresh request for all pages');
    SpreadsheetApp.getActiveSpreadsheet().toast('Wszystkie strony zostały odświeżone!', 'Sukces', 3);
  } catch (error) {
    Logger.log('Error sending manual refresh request: ' + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast('Błąd podczas odświeżania: ' + error.toString(), 'Błąd', 5);
  }
}

/**
 * Funkcja pomocnicza do jednorazowego utworzenia triggera 'onEdit'.
 * Uruchom ją raz ręcznie z edytora skryptów.
 */
function createOnEditTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerExists = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEdit' && triggers[i].getEventType() === ScriptApp.EventType.ON_EDIT) {
      triggerExists = true;
      break;
    }
  }

  if (!triggerExists) {
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onEdit()
      .create();
    Logger.log('OnEdit trigger created successfully.');
  } else {
    Logger.log('OnEdit trigger already exists.');
  }
}
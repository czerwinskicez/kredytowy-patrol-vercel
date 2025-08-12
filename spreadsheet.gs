var secret = "{REVALIDATE_SECRET@.env.local}";

function onEdit(e) {
  var sheetName = e.source.getActiveSheet().getName();
  
  var url = 'https://kredytowypatrol.pl/api/revalidate?secret='+secret;
  
  var payload = {
    'sheetName': sheetName
  };
  
  var options = {
    'method'      : 'post',
    'contentType' : 'application/json',
    'payload'     : JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(url, options);
    Logger.log('Successfully sent revalidation request for sheet: ' + sheetName);
  } catch (error) {
    Logger.log('Error sending revalidation request: ' + error.toString());
  }
}

function onManualRefresh() {
  var url = 'https://kredytowypatrol.pl/api/revalidate?secret='+secret;
  
  var payload = {
    'sheetName': 'ALL'
  };
  
  var options = {
    'method'      : 'post',
    'contentType' : 'application/json',
    'payload'     : JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(url, options);
    Logger.log('Successfully sent manual refresh request for all pages');
    
    // Opcjonalnie: pokaż toast notification w Google Sheets
    SpreadsheetApp.getActiveSpreadsheet().toast('Wszystkie strony zostały odświeżone!', 'Sukces', 3);
  } catch (error) {
    Logger.log('Error sending manual refresh request: ' + error.toString());
    
    // Opcjonalnie: pokaż błąd w Google Sheets
    SpreadsheetApp.getActiveSpreadsheet().toast('Błąd podczas odświeżania: ' + error.toString(), 'Błąd', 5);
  }
}

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
$(document).ready(function () {
	console.log('documents ready');
	var len = 9;
	let initiativeArray = [];
	for(var i = 1; i < len-1; i++) {
		let pageArray = [];
		var page = i
		pageArray.push(page);
		var url = "https://api.monday.com:/pulses.json" //need only 1 quotation mark for first portion of url(protocol + host)\
		var api_key = '--REMOVED--'
		var queryString = url + "?page=" + page + "&" + "per_page=25" + "&" + "order_by_latest=true" + "&" + "api_key=" + api_key; // put all out variables together and serve to getJSON function
		localStorage.setItem('lcQueryString', queryString);
		var newQuerystring = localStorage.getItem('lcQueryString');
		
		// if localStorage variable existws
		// feb 7th current PROGRESS == NEED TO CREATE A LOCALSTORAGE VARIABLE THAT IS INITIALIZED 
		
		if(globalUserArray.userObj) { // if value for userObj is NOT undefined continue...
			continue;
		}
		else if(!globalUserArray.userObj) { // ... else create a new userObj
			var globalUserArray = []; // we push ALL of the userObjects within the global User Array to store all users, their pulses and the amount of SP points that have completed for every response.
			globalUserArray.userObj = {};
			globalUserArray.userObj['owner'] = '';
			globalUserArray.userObj['totalSP'] = 0;
			globalUserArray.userObj.userInitArray = [];
		} 
		$.getJSON(queryString, function(data) {
			console.log(data);
			if(data !== null) {
				var ul = document.getElementById("metrics-list");
				for( var j=0 ; j < data.length - 1; j++) { // the length of 25 items response
					var initiativeValue;
					var groupIdValue;
					var initiativeSp;  // story points
					var initiativeTitle;
					var initiativeSpTitle; 
					var currentBoard;
					var currentOwner;
					var storyOwner;
					var pulseId;
					groupIdValue = data[j].board_meta.group_id;      // i.e. 'New_Group98'
					currentBoard = "new_group"; 
					if (groupIdValue == currentBoard) { 
						initiativeValue = data[j].column_values[7].value; // i.e.  'PMS 444'
						initiativeTitle = data[j].column_values[7].title; // i.e.'Initiative'
						storyOwner = data[j].column_values[2].value['name']; // i.e. 'Jake Westerfield'
						currentOwner = storyOwner; // check the current user against globalUserArray's userObjs owner
						initiativeSpTitle = data[j].column_values[8].title; // i.e. 'Story Points'
						initiativeSp = data[j].column_values[8].value.index; // i.e. 9(integer of users story points)
						pulseId = data[j].pulse.id;
						var total_SP;
						//storyOwner_photo = data[j].column_values[2].value.photo_url; // i.e. 'Jake Westerfield' cant transform into actual photo instead of url string
						if(storyOwner === 'undefined' || null) {
							var storyOwnerNullValue = storyOwner;
							console.log('ERROR: This storyOwner for ' + storyOwner + ' is ' + storyOwnerNullValue + ' for ' + groupIdValue + ' board ' + ' for pulseID: ' + pulseId); //null?? null for null??
						}
						if(initiativeSp === 'undefined' || null) { // '40' == NULL 
							if(initiativeSp == 0) {
								continue; //if equal to zero just out of this loop and continue
							}
							else if(initiativeSp != 0) {
								var initiativeSpNullValue = initiativeSp;
								console.log('ERROR: This Story Point value ' + initiativeSpTitle + ' is ' + '<span><b>' + initiativeSpNullValue + '</span></b>' + ' for ' + groupIdValue + ' board'); 
							}
						}
						if (initiativeValue === 'undefined' || null) {  // null check for i.e.  'PMS 444'
							var initiativeValueNullValue = initiativeValue;
							console.log('ERROR: This initiativeValue for ' + initiativeTitle + ' is ' + initiativeValueNullValue + ' for ' + groupIdValue + ' board'); 
							$('#metrics-list').append('<div>' + ' ' + ' Our ' + initiativeTitle + ' ' + ' Values: ' + '<span style="color:red"><b>' + initiativeValueNullValue + '</b></span>' + ' ' + ' for the ' + groupIdValue + ' sprint. Courtesy of ' + ' ' + '<span style="color:green"><b>' + storyOwner + '</b></span>' +  ', w/  ' + initiativeSp + ' Story Points' + '<hr>'  + '</div>' + '<br>');
						}
						else {
							// Creating a switch statement to assign monday.com API Story Point index values to current monday.com sprint story point values
							switch(initiativeSp) {
								case null: 
									initiativeSp = null; //40?? 
									console.log('current initiativeSp is 40 or not assigned a value so its: ' + initiativeSp); //null
									break;
								case 0: 
									initiativeSp = 3;
									//console.log('current initiativeSp: ' + initiativeSp);   // 3
									break;
								case 1: 
									initiativeSp = 0.5;
									//console.log('current initiativeSp: ' + initiativeSp);  // 0.5
									break;
								case 2: 
									initiativeSp = 20;
									//console.log('current initiativeValue: ' + initiativeSp);  // 20
									break;
								case 6: 
									initiativeSp = 0;
									//console.log('current initiativeSp: ' + initiativeSp);  // 0
									break;
								case 9: 
									initiativeSp = 2;
									//console.log('current initiativeSp: ' + initiativeSp);  // 2
									break;
								case 10: 
									initiativeSp = 100;
									//console.log('current initiativeValue: ' + initiativeSp);  // 100
									break;
								case 12: 
									initiativeSp = 13;
									//console.log('current initiativeSp: ' + initiativeSp);	// 13
									break;
								case 14: 
									initiativeSp = 8;
									//console.log('current initiativeSp: ' + initiativeSp);	// 8
									break;
								case 15: 
									initiativeSp = 1;
									//console.log('current initiativeSp: ' + initiativeSp); // 1
									break;
								case 19: 
									initiativeSp = 5;
									//console.log('current initiativeSp: ' + initiativeSp); // 5
									break;
								case undefined: 
									initiativeSp = 'undefined';
									//console.log('current initiativeSp: ' + initiativeSp); // undefined
									break;
							}
							var userNameKey = storyOwner; // "Steve" only a string value, set to a key value of empty object
							var tempUserObj = {};
							var userObj = tempUserObj;
							userObj.userInitArray = [];
							if(globalUserArray.userObj['owner'] === currentOwner) { //if 'the user exist in the globalArray we increment if not we create a new userObj
								//console.log('Same user as before: ' + globalUserArray.userObj['owner'] +  ' == ' + currentOwner); //the matching 
								// push the owner object to the story owners SPs. 
								// We create another userInit obj but this time we set the values to the actual users name in the globalUserArray. 
								var userInit = {}; //we create empty objs to store new intiative title we add
								var userInitKey = initiativeValue; // i.e.  'EUIL'
								userInit['title'] = initiativeValue; // i.e.  'EUIL'
								userInit['value'] = initiativeSp; // i.e.  '13'
								userInit[userInitKey]; // i.e.'EUIL' is NOW the key for this new userInit obj, and the name
								if(globalUserArray.userObj.total_SP == true) { // if a value exists for the current user in the globalUserArray, increment the value of the total_SP by the value of the new initiative_SP
									total_SP = userObj.totalSP += initiativeSp; // we add the current value of userObj's totalSP + new intiative SP 
								}
								else if(globalUserArray.userObj.total_SP == null) {
									console.log('Seems our total_SP for this existing user has a NULL value. Try adding value, to the userObj that is.');
								}
							} 
							else if(globalUserArray.userObj['owner'] !== currentOwner) { // else we create a new user, and add the initiative and values to their object
								userObj['owner'] = currentOwner;
								userObj['totalSP'] = initiativeSp;
								userObj[userNameKey];	// 0: { "Jake"; } 
								
								var userInit = {}; //we create empty objs to store new intiative title we add
								var userInitKey = initiativeValue; // i.e.  'EUIL'
								userInit['title'] = initiativeValue; // i.e.  'EUIL'
								userInit['value'] = initiativeSp; // i.e.  '13'
								userInit[userInitKey]; // i.e.'EUIL' is NOW the key for this new userInit obj, and the name
								
								userObj.userInitArray.push(userInit); //add this into the userInitArray for this new userObj
								
								//userArray.push(userObj); // if this storyOwner/userName doesnt exist inside userArray, 
								globalUserArray.push(globalUserArray.userObj);

								// Should grab the initiativeValue from break statement then execute and add value to initiativeValue var below, in order
								$('#metrics-list').append('<div>' + ' ' + ' Our ' + initiativeTitle + ' ' + ' Values: ' + '<b>' + initiativeValue + '</b>' + ' ' + ' for the ' + groupIdValue + ' sprint. PulseID is:  ' + pulseId +  ', w/  ' + initiativeSp + ' ' + initiativeSpTitle +'<hr>'  + '</div>' + '<br>');
								initiativeArray.push(initiativeValue);
							}
						}
					}
					else {
						console.log('this is not apart of the current board: ' + groupIdValue);
					}
				}
			} else {
				console.log('data object is Null or has "undefined" value');
			}
			initiativeArray.sort();
			//console.log(initiativeArray); // Should display an array of initiativeValues I pushed into this array
		});
	}
});


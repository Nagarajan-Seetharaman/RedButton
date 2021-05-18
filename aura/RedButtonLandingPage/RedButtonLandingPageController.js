({
	landingHandleChange : function(component, event, helper) {
        let radioGrpValue = component.get("v.value");
        if(radioGrpValue=="Yes"){
            component.set("v.accList", null);
            component.set("v.searchAcctText", "");            
            component.set("v.isSearchResNotFound", "true");
        }
        if(radioGrpValue=="No"){
            component.set("v.caseList", null);
            component.set("v.searchText", "");            
            component.set("v.isSearchResNotFound", "true");
        }
		
	},
    CsrRosterClick : function(component, event, helper) {
        window.location.href = "https://honeywellprod.sharepoint.com/:x:/t/Infosys_Agent/EV3AaixerlJAgaHFFDxk174BSR5l18QuGwSIkMxrHSlcDA?e=wrq1FD";
    },
    EcpClick : function(component, event, helper) {
        window.location.href = "https://honeywellprod.sharepoint.com/:p:/r/teams/Infosys_Agent/SiteAssets/default/Escalation%20Path-Contact%20Points.pptx?d=w67d46e72df9043b4be0fd613e5b52245&csf=1&e=4uWPVj";
    },
    GceInfosysClick : function(component, event, helper) {
        window.location.href = "https://honeywellprod.sharepoint.com/:p:/t/Infosys_Agent/EYP6BjMb5C1Krh8aEv_d81sBzqwaemoGoXeL3kdlKGGyGw";
    },
    handleClick : function(component, event, helper) {
		console.log('inside call');
        console.log("it's work ", event.currentTarget.dataset.myid);
        var action = component.get("c.fetchCaseInfo");
            action.setParams({
                "casId" : event.currentTarget.dataset.myid
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =JSON.parse(response.getReturnValue());
                    console.log(records);
                    if(records.casCommList!=null && records.casCommList!=undefined){
                        let casComm = records.casCommList;
                        casComm.forEach(function(casCom){                        
                            casCom.CreatedBy = casCom.CreatedBy.Name;
                        });
                    }
                    else
                        records.casCommList=null;
                    
                    console.log('records.casCommList: '+records.casCommList);
                    component.set("v.caseInfoMap", records.casInfomap);
                    component.set("v.casCommList", records.casCommList);
                    component.set("v.isSearchResFound", "false");
                    component.set("v.isSearchResNotFound", "false");
                    component.set("v.isSearchNeed", "false");
                    component.set("v.isHomeHeaderNeed", "false");
                    component.set("v.isCasInfoSelected", "true");
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        
	},
    acctHandleClick : function(component, event, helper) {
		console.log('inside acct call');
        console.log("it's work ", event.currentTarget.dataset.myid);        
        component.set("v.isSearchNeed", false);
        component.set("v.isSearchResFound", false);
        component.set("v.isHomeHeaderNeed", false);
        component.set("v.isWorkstreamNeeded", true);
        let acctId = event.currentTarget.dataset.myid;
        var casInfoInactive = component.get("v.caseInfoInactiveMap");
        casInfoInactive["AccountId"] = acctId; 
        component.set("v.caseInfoInactiveMap",casInfoInactive);        
	},
    handleKeyUp: function (component, evt) {
        debugger;
        //var isEnterKey = evt.keyCode === 13;
        
        //if (isEnterKey) {
            var selectedValue=  component.find("searchValue").get("v.value");
            console.log('dropdownvalue:'+selectedValue);
            console.log('textinput:'+component.get("v.searchText"));
            var action = component.get("c.fetchCases");
            action.setParams({
                "searchOption" : selectedValue,
                "searchText" : component.get("v.searchText")
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =response.getReturnValue();
                    console.log(records);
                    records.forEach(function(record){
                        record.linkName = '/'+record.Id;
                        record.OwnerName = record.Owner.Name;
                    });
                    component.set("v.caseList", records);
                    if(records.length>0){
                        component.set("v.isSearchResNotFound", "false");
                        component.set("v.isSearchResFound", "true");
                    }
                    else
                        component.set("v.isSearchResNotFound", "true");
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        //}
    },
    handleAcctKeyUp: function (component, evt) {
        debugger;
        //var isEnterKey = evt.keyCode === 13;        
        //if (isEnterKey) {
            var selectedValue=  component.find("searchValueAcct").get("v.value");
            console.log('dropdownvalue:'+selectedValue);
            console.log('textinput:'+component.get("v.searchAcctText"));
            var action = component.get("c.fetchAccts");
            action.setParams({
                "searchOption" : selectedValue,
                "searchText" : component.get("v.searchAcctText")
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =JSON.parse(response.getReturnValue());
                    console.log(records);                    
                    component.set("v.accList", records);
                    if(records.length>0){
                        component.set("v.isSearchResNotFound", "false");
                        component.set("v.isSearchResFound", "true");
                    }
                    else
                        component.set("v.isSearchResNotFound", "true");
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
            
        //}
    },
    // this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
    },
    
    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);
    },
    backToHome: function (component, evt) {
        window.location.reload();
    },
    CsrYesClick: function (component, evt) {
        window.location.href = "https://honeywellaero.secure.force.com/Liveagent/apex/MinuteCSRPreChatForm?endpoint=https://honeywellaero.secure.force.com/Liveagent/apex/tenminutecsrchatwindow?language%3Den_US%23deployment_id%3D572a0000000PUui%26org_id%3D00D30000000dWxY%26button_id%3D57313000000TPcz%26session_id%3D4e8fe80d-fff5-4749-9521-e24bdeea9dff";
    },
    CsrNoClick: function (component, evt) {
        component.set("v.isLandingPage", false);
        component.set("v.isSearchNeed", true);
        component.set("v.isSearchResNotFound", true);
    },    
    casInfoYesClick: function (component, evt) {
        component.set("v.modelBodyValue", "Thank you for using GCE Connect. You may now close this page.");
        component.set("v.isOpenModel", true);        
    },
    casInfoNoClick: function (component, evt) {
        var casStatus = component.get("v.caseInfoMap.IsClosed");
        if(casStatus!="true"){
            component.set("v.isCasInfoSelected", false); 
            component.set("v.isCasInfoHelpNeeded", true);  
        }
        else{
            component.set("v.isCasInfoSelected", false); 
            component.set("v.isCasInfoInactiveHelpNeeded", true);
            
            /*component.set("v.isWorkstreamNeeded", true);
            let casId = component.get("v.caseInfoMap.CaseId");
            var casInfoInactive = component.get("v.caseInfoInactiveMap");
            casInfoInactive["CasId"] = casId; 
            component.set("v.caseInfoInactiveMap",casInfoInactive); */
        }
               
    },
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpenModel", false);
        window.location.reload();
    },
    onFileUploaded:function(component,event,helper){
        debugger;
        var AttachedFilesArr = [];
        var UploadedFilesArr = [];
        var uploadedFiles = event.getParam("files");
        [].forEach.call(uploadedFiles, function(file) {
            if(file.name.length >79)
                UploadedFilesArr.push({'Title': file.name})
        });
        if(UploadedFilesArr.length>0)
            component.set("v.isFileTitleExceeded", true);
        else
            component.set("v.isFileTitleExceeded", false);
        
        component.set("v.fileTitleExceedList", UploadedFilesArr);
        [].forEach.call(uploadedFiles, function(file) {
            let reader = new FileReader();
            reader.onload = function() {
                /*var dataURL = reader.result;
                var content = dataURL.match(/,(.*)$/)[1];
                AttachedFilesArr.push({'Title': file.name,                                       
                                       'base64Data':content});*/
                let base64 = 'base64,';
                let content = reader.result.indexOf(base64) + base64.length;
                let fileContents = reader.result.substring(content);
                if(file.name.length <80)
                    AttachedFilesArr.push({
                        Title: file.name,
                        VersionData: fileContents
                    });
                component.set("v.fileToBeUploaded", AttachedFilesArr);                
            };
            reader.readAsDataURL(file);
        });
        console.log(UploadedFilesArr);
        console.log(AttachedFilesArr);        
    },
    
    removeRow: function(component, event, helper) {
        var attfiles = component.get("v.fileToBeUploaded");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.record;
        attfiles.splice(index, 1);
        component.set("v.fileToBeUploaded", attfiles);
    },
    casInfoHelpSubmitClick: function (component, evt) {
        debugger;
        var allValid = component.find('casInfoHelpForm').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        if (allValid) {
            var fileUploadValue=[];
            fileUploadValue = component.get("v.fileToBeUploaded");
            let casId = component.get("v.caseInfoMap.CaseId");
            //component.set("v.caseInfoHelpNeededMap.CaseId",casId);
            var mpatest = component.get("v.caseInfoHelpNeededMap");
            mpatest["casId"] = casId; 
            component.set("v.caseInfoHelpNeededMap",mpatest);       
            console.log(mpatest);
            console.log("caseInfoHelpNeededMap: "+component.get("v.caseInfoHelpNeededMap"));
            var action = component.get("c.updateCaseInfo");
            action.setParams({
                "filesToInsert" : fileUploadValue,
                "casInfoHelpNeededMap" : component.get("v.caseInfoHelpNeededMap")
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =response.getReturnValue();
                    console.log(records);
                    component.set("v.modelBodyValue", "Thank you for your request. Please refer to "+records+" for any future inquiries. Your request will be addressed within 48 hours or sooner.");
                    component.set("v.isOpenModel", true);                     
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);        
        }
    },
    casInfoHelpCancelClick: function (component, evt) {
        window.location.reload();
    },
    casInfoInactiveHelpSubmitClick: function (component, evt) {
        debugger;
        var allValid = component.find('casInfoInactiveHelpForm').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        if (allValid) {
            var fileUploadValue=[];
            fileUploadValue = component.get("v.fileToBeUploaded");
            let casId = component.get("v.caseInfoMap.CaseId");
            var mpatest = component.get("v.caseInfoHelpNeededMap");
            mpatest["casId"] = casId; 
            component.set("v.caseInfoHelpNeededMap",mpatest);       
            console.log(mpatest);
            console.log("caseInfoHelpNeededMap: "+component.get("v.caseInfoHelpNeededMap"));
            var action = component.get("c.createChildCaseAndUpdateCaseInfo");
            action.setParams({
                "filesToInsert" : fileUploadValue,
                "casInfoInactiveMap" : component.get("v.caseInfoHelpNeededMap")
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =response.getReturnValue();
                    console.log(records);
                    component.set("v.modelBodyValue", "Thank you for your request. Please refer to "+records+" for any future inquiries. Your request will be addressed within 48 hours or sooner.");
                    component.set("v.isOpenModel", true);                     
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);        
        }
    },
    workstreamHandleChange : function(component, event, helper) {
        component.set("v.workstreamSelectedDrpDownValue",null);
	},
    casInfoInactiveSubmitClick: function (component, evt) {
        debugger;
        var allValid = component.find('casInfoInactiveForm').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        
        let workstreamOption = component.get("v.optionWorkstreamValue");
        if(workstreamOption=="ROI"){
            let sltCmp = component.find("workstreamRoiSel");
            if(!sltCmp.get("v.validity").valid){ //Magic happens here
                sltCmp.showHelpMessageIfInvalid(); //This will show validation messages for user. 
                return;
            }
        }
        else if(workstreamOption=="Spares"){
            let sltCmp = component.find("workstreamSparesSel");
            if(!sltCmp.get("v.validity").valid){ //Magic happens here
                sltCmp.showHelpMessageIfInvalid(); //This will show validation messages for user. 
                return;
            }
        }
        else if(workstreamOption=="OEM"){
            let sltCmp = component.find("workstreamOemSel");
            if(!sltCmp.get("v.validity").valid){ //Magic happens here
                sltCmp.showHelpMessageIfInvalid(); //This will show validation messages for user. 
                return;
            }
        }
        
        if (allValid) {
            var fileUploadValue=[];
            fileUploadValue = component.get("v.fileToBeUploaded");
            let casComplexity = component.get("v.optionCasInfoInactiveValue");
            let casWorkstream = component.get("v.workstreamSelectedDrpDownValue");
            let casWorkstreamOption = component.get("v.optionWorkstreamValue");
            console.log("CasId: "+component.get("v.caseInfoInactiveMap.CasId"));            
            console.log("AccountId: "+component.get("v.caseInfoInactiveMap.AccountId"));
            let caseIdVal = component.get("v.caseInfoInactiveMap.CasId");
            let isNewCase=true;
            if(caseIdVal!=null && caseIdVal!="")
                isNewCase=false;
            var casInfo = component.get("v.caseInfoInactiveMap");
            casInfo["Complexity"] = (casComplexity!=null && casComplexity!="") ? casComplexity : "";
            casInfo["Workstream"] = (casWorkstream!=null && casWorkstream!="") ? casWorkstream : "";
            casInfo["WorkstreamOption"] = (casWorkstreamOption!=null && casWorkstreamOption!="") ? casWorkstreamOption : "";
            component.set("v.caseInfoInactiveMap",casInfo);       
            console.log(casInfo);
            console.log("caseInfoInactiveMap: "+component.get("v.caseInfoInactiveMap"));
            var action = component.get("c.createCaseInfo");
            action.setParams({
                "filesToInsert" : fileUploadValue,
                "casInfoInactiveMap" : component.get("v.caseInfoInactiveMap"),
                "isNewCase" : isNewCase
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var records =response.getReturnValue();
                    console.log(records);
                    component.set("v.modelBodyValue", "Thank you for your request. Please refer to "+records+" for any future inquiries. Your request will be addressed within 48 hours or sooner.");
                    component.set("v.isOpenModel", true);                     
                }
                else if(state === "ERROR"){ 
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            // log the error passed in to AuraHandledException
                            console.log("Error message: " + 
                                        errors[0].message);
                            component.set("v.modelBodyValue", errors[0].message);
                            component.set("v.isOpenModel", true);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);        
        }
    },
    casInfoInactiveCancelClick: function (component, evt) {
        window.location.reload();
    },
    
})
//Get various part of the web extensiion framewrork that we need.
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionParent } = ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm");
//var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
//var {Log4Moz} = ChromeUtils.import("resource:///modules/gloda/log4moz.js");
const {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
var prefBranch ;
var pref1 ;
var pref2 ;
var Pref_Enable_ST ="extensions.ShowAllBodyParts@kamens.us.EnableSt"
var Const_Actvt_st=1;

var sabp_bgrndAPI = class extends ExtensionCommon.ExtensionAPI
{

onShutdown(isAppShutdown) {
            if (isAppShutdown) return;
            // invalidate the startup cache, such that after updating the addon the old
            // version is no longer cached
             shutdown();

            console.log("webextension:shutdown");
            }

    getAPI(context)
        {
               return{
                sabp_bgrndAPI:
                            {
                                OnStartup: function()
                                {
                                    startup();
                                },

                                OnInitialize: function()
                                {
                                     prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces.nsIPrefBranch);
                                    if (! ("addObserver" in prefBranch))
                                    prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);

                                     pref1 = "extensions.ShowAllBodyParts.active";
                                     pref2 = "mailnews.display.show_all_body_parts_menu";

                                },
                                Oninstalled: function()
                                {
                                    install();
                                },
                                //get
                                getBoolPref:function(pref)
                                {
                                  return  prefBranch.getBoolPref(pref);
                                },

                                //set

                                setBoolPref:function(pref,elt_value)
                                {
                                        prefBranch.setBoolPref(pref,elt_value);
                                }


                            }
                    };
        }
};

function getActive() {
    var active;
    try { var active = prefBranch.getBoolPref(pref1); }
    catch (ex) { active = false; }
    return active;
}

function observer(aSubject, aTopic, aData) {
    prefBranch.removeObserver(pref2, observer);
    prefBranch.setBoolPref(pref1, false);
}

function startup() {
    var active = getActive();
    if (active) {
	prefBranch.setBoolPref(pref2, true);
	prefBranch.addObserver(pref2, observer, false);
    }
    else if (prefBranch.getBoolPref(Pref_Enable_ST)==false){
        prefBranch.setBoolPref(pref1, true);
        prefBranch.setBoolPref(pref2, true);
        prefBranch.addObserver(pref2, observer, false);
    }


    Services.obs.addObserver(WindowObserver, "mail-startup-done", false);
    forEachOpenWindow(loadIntoWindow);
}

function shutdown() {
    var active = getActive();
    if (active) {
	prefBranch.removeObserver(pref2, observer);
    prefBranch.setBoolPref(pref2, false);
    uninstall();
    }

}

function install() {
    var active = getActive();
    if (active) return;
    var old;
    try { old = prefBranch.getBoolPref(pref2); }
    catch (ex) { old = false; }
    if (! old) {
	prefBranch.setBoolPref(pref1, true);
    prefBranch.setBoolPref(pref2, true);
    prefBranch.setBoolPref(Pref_Enable_ST,true)
    }
}

function uninstall() {
    prefBranch.setBoolPref(pref1, false);
    prefBranch.setBoolPref(Pref_Enable_ST,false)
}

function forEachOpenWindow(todo) { // Apply a function to all open windows
  for (let window of Services.wm.getEnumerator("mail:3pane")) {
    if (window.document.readyState != "complete")
      continue;
    todo(window);
  }
}

var WindowObserver = {
    observe: function(aSubject, aTopic, aData) {
        var window = aSubject;
        var document = window.document;
        if (document.documentElement.getAttribute("windowtype") ==
            "mail:3pane") {
            loadIntoWindow(window);
        }
    },
};

function loadIntoWindow(window) {
}

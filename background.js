
 async function  onStartup (){
    try{
      await browser.sabp_bgrndAPI.OnStartup();
    }
    catch(err){console.error(err);}
}

async function  OnInitialize (){
    try{
      await browser.sabp_bgrndAPI.OnInitialize();
    }
    catch(err){console.error(err);}
}



var listner = function(){
    try{browser.sabp_bgrndAPI.Oninstalled();}
    catch(err){console.error(err);}
  };

OnInitialize();
onStartup();
browser.runtime.onInstalled.addListener(listner);
(function () {
  document.tidioIdentify = {
    distinct_id: 'aksodokas', // Unique visitor ID in your system
    email: 'fdwilogo@gmail.com', // visitor email
    name: `Titit Bau`, // Visitor name
    phone: 'null', //Visitor phone
  };

  function onTidioChatApiReady() {
    window.tidioChatApi.hide();
    window.tidioChatApi.on('close', function () {
      window.tidioChatApi.hide();
    });
  }

  if (window.tidioChatApi) {
    window.tidioChatApi.on('ready', onTidioChatApiReady);
  } else {
    document.addEventListener('tidioChat-ready', onTidioChatApiReady);
  }
})();

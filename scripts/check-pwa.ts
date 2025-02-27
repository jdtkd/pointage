async function checkPWA() {
  console.log('Vérification de la PWA...');

  // Vérifier le manifeste
  try {
    const manifestResponse = await fetch('/manifest.json');
    if (!manifestResponse.ok) {
      throw new Error('Manifeste non trouvé');
    }
    const manifest = await manifestResponse.json();
    console.log('✅ Manifeste trouvé et valide');
    console.log('Icons:', manifest.icons.length);
    console.log('Start URL:', manifest.start_url);
  } catch (error) {
    console.error('❌ Erreur manifeste:', error);
  }

  // Vérifier le service worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker enregistré');
      console.log('Scope:', registration.scope);
    } catch (error) {
      console.error('❌ Erreur Service Worker:', error);
    }
  } else {
    console.warn('⚠️ Service Worker non supporté');
  }
}

checkPWA(); 
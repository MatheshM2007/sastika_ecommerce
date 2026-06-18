'use client';

// WebAuthn / Passkey utilities
// Uses the browser's WebAuthn API for passkey authentication

export async function isPasskeySupported(): Promise<boolean> {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof PublicKeyCredential !== 'undefined'
  );
}

export async function registerPasskey(username: string, userId: string) {
  if (!(await isPasskeySupported())) {
    throw new Error('Passkey is not supported on this device/browser');
  }

  // Create credential
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Sastika',
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(userId),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'required',
      userVerification: 'required',
    },
    timeout: 60000,
  };

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });

  return credential;
}

export async function authenticateWithPasskey() {
  if (!(await isPasskeySupported())) {
    throw new Error('Passkey is not supported on this device/browser');
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    rpId: window.location.hostname,
    timeout: 60000,
    userVerification: 'required',
  };

  const assertion = await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  });

  return assertion;
}

// For QR-based login: generates a session QR code
export function generateLoginQR(): string {
  const sessionId = crypto.randomUUID();
  const loginUrl = `${window.location.origin}/auth/qr-login?session=${sessionId}`;
  return loginUrl;
}
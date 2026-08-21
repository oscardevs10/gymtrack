import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { isSupabaseConfigured } from '../lib/supabase';

export function Auth() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('La app todavía no está conectada a Supabase. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setLoading(true);
    const result =
      mode === 'login' ? await signIn(email, password) : await signUp(email, password, name || email.split('@')[0]);
    setLoading(false);

    if (result.error) {
      setError(translateError(result.error));
      return;
    }

    if (mode === 'signup') {
      setSignupDone(true);
    } else {
      navigate('/');
    }
  }

  async function handleGoogle() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('La app todavía no está conectada a Supabase.');
      return;
    }
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setGoogleLoading(false);
      setError(translateError(result.error));
    }
    // en éxito, Supabase redirige a Google y luego de vuelta — no hay más que hacer aquí
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <Dumbbell size={24} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">GYMTRACK</h1>
          <p className="text-sm text-text-muted mt-1">Tu progreso, en un solo lugar.</p>
        </div>

        {!signupDone && (
          <>
            <Button
              variant="secondary"
              fullWidth
              disabled={googleLoading}
              onClick={handleGoogle}
              icon={googleLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
              className="mb-4"
            >
              Continuar con Google
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-dim">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        {signupDone ? (
          <div className="bg-surface border border-border rounded-2xl p-5 text-center">
            <p className="text-text font-semibold mb-1">Revisa tu correo</p>
            <p className="text-sm text-text-muted">
              Te enviamos un enlace de confirmación a <span className="text-text">{email}</span>. Confírmalo y luego
              inicia sesión.
            </p>
            <Button className="mt-4" fullWidth variant="secondary" onClick={() => { setMode('login'); setSignupDone(false); }}>
              Volver a inicio de sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
            {mode === 'signup' && (
              <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" fullWidth disabled={loading} className="mt-1">
              {loading ? <Loader2 size={18} className="animate-spin" /> : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>
          </form>
        )}

        {!signupDone && (
          <p className="text-center text-sm text-text-muted mt-4">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="text-primary font-medium"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function translateError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (message.includes('already registered')) return 'Ese correo ya está registrado.';
  if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
  return message;
}

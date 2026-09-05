'use client';

import { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Gamepad2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import { storeBrowserSession } from '../lib/browser-session';

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

interface AuthResponse {
  accessToken?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    roles?: string[];
  };
  error?: {
    message?: string;
  };
  message?: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function getResponseMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as AuthResponse;
    return body.error?.message ?? body.message ?? 'Проверьте введённые данные и попробуйте снова.';
  } catch {
    return 'Сервис временно недоступен. Попробуйте снова через несколько минут.';
  }
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === 'sign-up';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Пароли не совпадают. Проверьте оба поля.');
      return;
    }
    if (isSignUp && !accepted) {
      setError('Подтвердите возраст и согласие с правилами платформы.');
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/${isSignUp ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(isSignUp ? { username } : {}),
        }),
      });
      if (!response.ok) {
        setError(await getResponseMessage(response));
        return;
      }
      const body = (await response.json()) as AuthResponse;
      if (
        !body.accessToken ||
        !body.user ||
        typeof body.user.username !== 'string' ||
        typeof body.user.email !== 'string'
      ) {
        setError('Сервер вернул неполные данные сессии.');
        return;
      }
      const sessionUser = {
        username: body.user.username,
        email: body.user.email,
        ...(typeof body.user.id === 'string' ? { id: body.user.id } : {}),
        ...(Array.isArray(body.user.roles) ? { roles: body.user.roles } : {}),
      };
      if (!storeBrowserSession(body.accessToken, sessionUser)) {
        setError(
          'Браузер запретил сохранить сессию. Разрешите локальное хранилище и повторите вход.',
        );
        return;
      }
      router.push('/profile');
    } catch {
      setError(
        'Не удалось связаться с API. Запустите backend на localhost:4000 или проверьте NEXT_PUBLIC_API_URL.',
      );
    } finally {
      setIsPending(false);
    }
  }

  function fillDemoAccount() {
    setEmail('captain@arena-grid.local');
    setPassword('ArenaGridDemo!2026');
    setError('');
  }

  return (
    <form
      className="authForm"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      noValidate
    >
      <div className="authFormHeading">
        <span className="sectionNumber">{isSignUp ? 'НОВЫЙ ИГРОК' : 'С ВОЗВРАЩЕНИЕМ'}</span>
        <h1>{isSignUp ? 'Создать аккаунт' : 'Войти в ARENA GRID'}</h1>
        <p>
          {isSignUp
            ? 'Один аккаунт для турниров, команд и всех результатов.'
            : 'Продолжите путь своей команды с того места, где остановились.'}
        </p>
      </div>

      {error.length > 0 && (
        <div className="formAlert" role="alert">
          {error}
        </div>
      )}

      {isSignUp && (
        <label className="fieldGroup">
          <span>Никнейм</span>
          <span className="inputShell">
            <UserRound size={17} />
            <input
              name="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              placeholder="player_one"
              pattern="[a-zA-Z0-9_]{3,32}"
              minLength={3}
              maxLength={32}
              autoComplete="username"
              required
            />
          </span>
          <small>3–32 символа: латиница, цифры и подчёркивание</small>
        </label>
      )}

      <label className="fieldGroup">
        <span>Email</span>
        <span className="inputShell">
          <Mail size={17} />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="player@example.com"
            autoComplete="email"
            required
          />
        </span>
      </label>

      <label className="fieldGroup">
        <span className="fieldLabelRow">
          Пароль
          {!isSignUp && <Link href="/auth/forgot-password">Забыли пароль?</Link>}
        </span>
        <span className="inputShell">
          <LockKeyhole size={17} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="Не менее 10 символов"
            minLength={10}
            maxLength={128}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
          />
          <button
            type="button"
            onClick={() => {
              setShowPassword((visible) => !visible);
            }}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>

      {isSignUp && (
        <>
          <label className="fieldGroup">
            <span>Повторите пароль</span>
            <span className="inputShell">
              <LockKeyhole size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                placeholder="Тот же пароль ещё раз"
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                required
              />
            </span>
          </label>
          <label className="checkField">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
              }}
              required
            />
            <span className="customCheck">
              <Check size={13} />
            </span>
            <span>
              Мне исполнилось 13 лет, я принимаю <Link href="#terms">условия</Link> и правила
              честной игры.
            </span>
          </label>
        </>
      )}

      <button className="button buttonPrimary authSubmit" type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="spinner" size={17} /> Подключаемся…
          </>
        ) : (
          <>
            {isSignUp ? 'Зарегистрироваться' : 'Войти'} <ArrowRight size={17} />
          </>
        )}
      </button>

      {!isSignUp && (
        <button className="demoAccountButton" type="button" onClick={fillDemoAccount}>
          Заполнить данные демо-капитана
        </button>
      )}

      <div className="authDivider">
        <span>или</span>
      </div>
      <button
        className="button discordButton"
        type="button"
        onClick={() => {
          setError('Discord OAuth появится после подключения провайдера. Используйте email.');
        }}
      >
        <Gamepad2 size={18} /> Продолжить через Discord
      </button>
      <p className="authSwitch">
        {isSignUp ? 'Уже есть аккаунт?' : 'Впервые на платформе?'}{' '}
        <Link href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'}>
          {isSignUp ? 'Войти' : 'Создать аккаунт'}
        </Link>
      </p>
    </form>
  );
}

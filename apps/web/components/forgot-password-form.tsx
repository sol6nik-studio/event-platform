'use client';

import { useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="authForm recoverySuccess">
        <CheckCircle2 size={38} />
        <span className="sectionNumber">ПИСЬМО ОТПРАВЛЕНО</span>
        <h1>Проверьте почту</h1>
        <p>
          Если аккаунт с адресом <strong>{email}</strong> существует, на него придёт ссылка для
          восстановления. Ответ одинаков для всех адресов — так безопаснее.
        </p>
        <Link className="button buttonSecondary" href="/auth/sign-in">
          <ArrowLeft size={16} /> Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authFormHeading">
        <span className="sectionNumber">ВОССТАНОВЛЕНИЕ</span>
        <h1>Забыли пароль?</h1>
        <p>Введите email аккаунта. Мы отправим инструкцию, если найдём такой адрес.</p>
      </div>
      <label className="fieldGroup">
        <span>Email</span>
        <span className="inputShell">
          <Mail size={17} />
          <input
            type="email"
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
      <button className="button buttonPrimary authSubmit" type="submit">
        Отправить ссылку <ArrowRight size={17} />
      </button>
      <Link className="backToAuth" href="/auth/sign-in">
        <ArrowLeft size={15} /> Вернуться ко входу
      </Link>
    </form>
  );
}

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Radio, ShieldCheck, Trophy } from 'lucide-react';
import { Brand } from './site-header';

interface AuthShellProps {
  children: ReactNode;
  variant?: 'default' | 'recovery';
}

export function AuthShell({ children, variant = 'default' }: AuthShellProps) {
  return (
    <main className="authPage">
      <div className="authTopbar">
        <Brand />
        <Link href="/" className="backToHome">
          <ArrowLeft size={15} /> На главную
        </Link>
      </div>
      <div className="authLayout">
        <section className="authVisual" aria-label="Возможности ARENA GRID">
          <div className="authVisualGrid" aria-hidden="true" />
          <div className="authVisualContent">
            <span className="eyebrow">
              <Radio size={13} /> ТУРНИРНАЯ СИСТЕМА
            </span>
            <h2>
              Каждый матч
              <br />
              имеет значение.
            </h2>
            <p>
              Единый профиль хранит команды, игровые аккаунты, историю матчей и все завоёванные
              места.
            </p>
            <div className="authBenefits">
              <div>
                <ShieldCheck size={20} />
                <span>
                  <strong>Проверенные составы</strong>
                  <small>Без случайных замен после roster lock</small>
                </span>
              </div>
              <div>
                <Trophy size={20} />
                <span>
                  <strong>Прозрачные результаты</strong>
                  <small>Счёт, сетка и история решений судьи</small>
                </span>
              </div>
              <div>
                <CheckCircle2 size={20} />
                <span>
                  <strong>Один следующий шаг</strong>
                  <small>Всегда понятно, что делать прямо сейчас</small>
                </span>
              </div>
            </div>
          </div>
          <div className="authVisualFoot">
            <span>42 турнира сейчас</span>
            <span>8 640 матчей проведено</span>
          </div>
        </section>
        <section className={`authFormSide${variant === 'recovery' ? ' authFormSideNarrow' : ''}`}>
          {children}
        </section>
      </div>
    </main>
  );
}

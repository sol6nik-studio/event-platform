import type { ReactNode } from 'react';
import { AccountHeader } from './account/account-header';
import {
  AccountMobileNavigation,
  AccountSidebar,
  type AccountSection,
} from './account/account-navigation';

export function ProfileShell({
  children,
  active = 'settings',
}: {
  children: ReactNode;
  active?: AccountSection;
}) {
  return (
    <main className="accountShell">
      <AccountHeader />
      <div className="accountBody">
        <AccountSidebar active={active} />
        <div className="accountMain">{children}</div>
      </div>
      <AccountMobileNavigation active={active} />
    </main>
  );
}

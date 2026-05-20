import { render } from '@react-email/render';
import type { ReactElement } from 'react';

export const renderEmail = async (component: ReactElement): Promise<string> => {
  return render(component);
};

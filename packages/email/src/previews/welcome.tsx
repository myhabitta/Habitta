import { WelcomeEmail } from '../templates/WelcomeEmail';

export default function WelcomePreview() {
  return (
    <WelcomeEmail
      clientName="María García"
      projectName="More"
      packageName="Premium"
      apartmentNumber="Apto 301"
      portalUrl="https://myhabitta.co/portal/1234567890"
    />
  );
}

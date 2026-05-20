import { DeliveryEmail } from '../templates/DeliveryEmail';

export default function DeliveryPreview() {
  return (
    <DeliveryEmail
      clientName="María García"
      projectName="More"
      packageName="Premium"
      apartmentNumber="Apto 301"
      portalUrl="https://myhabitta.co/portal/1234567890"
    />
  );
}

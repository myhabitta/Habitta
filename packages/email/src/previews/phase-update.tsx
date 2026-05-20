import { PhaseUpdateEmail } from '../templates/PhaseUpdateEmail';

export default function PhaseUpdatePreview() {
  return (
    <PhaseUpdateEmail
      clientName="María García"
      projectName="More"
      packageName="Premium"
      phaseName="Acabados"
      phaseNumber={3}
      portalUrl="https://myhabitta.co/portal/1234567890"
    />
  );
}

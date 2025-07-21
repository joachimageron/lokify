import { Router } from 'express';
import MailClient from '../utils/mailClient';

const router = Router();

router.post('/send-confirmation', async (req, res) => {
  const { to, email, dashboardUrl } = req.body;
  try {
    await MailClient.getInstance().sendEmailWithTemplate(
      [to],
      'Bienvenue sur Lokify',
      'welcome',
      { email, dashboardUrl, currentYear: new Date().getFullYear() }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Email non envoyé', details: error });
  }
});

export default router;

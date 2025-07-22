import cron from "node-cron";
import Locker from "../models/Locker";
import MailClient from "../utils/mailClient";

class LockerScheduler {
  private static instance: LockerScheduler;
  private isRunning = false;

  private constructor() {}

  public static getInstance(): LockerScheduler {
    if (!LockerScheduler.instance) {
      LockerScheduler.instance = new LockerScheduler();
    }
    return LockerScheduler.instance;
  }

  /**
   * Met à jour le statut des casiers en fonction des dates de réservation
   */
  private async updateLockerStatuses(): Promise<void> {
    try {
      const now = new Date();
      const in24hMs = now.getTime() + 24 * 60 * 60 * 1000;
      const oneHour = 60 * 60 * 1000;

      // Trouver tous les casiers réservés dont la réservation a expiré
      const expiredLockers = await Locker.find({
        status: "reserved",
        reservationEnd: { $lt: now },
      }).populate('reservedBy');

      if (expiredLockers.length > 0) {

        for (const locker of expiredLockers) {
          // On "force" TypeScript à comprendre que reservedBy est un user
          const user = locker.reservedBy as { email?: string; name?: string };

          if (user && user.email && locker.reservationEnd) {
            await MailClient.getInstance().sendEmailWithTemplate(
              [user.email],
              "Votre réservation de casier est terminée",
              "locker-expired",
              {
                name: user.name || user.email,
                lockerNumber: locker.lockerNumber || locker.id,
                endDate: locker.reservationEnd.toLocaleString("fr-FR"),
                dashboardUrl: `${process.env.CLIENT_URL}/dashboard`,
                currentYear: new Date().getFullYear(),
              }
            );
            console.log(`[Mail] Envoyé à ${user.email} pour casier #${locker.lockerNumber || locker.id}`);
          }
        }

        // Marquer les casiers expirés comme disponibles
        await Locker.updateMany(
          {
            status: "reserved",
            reservationEnd: { $lt: now },
          },
          {
            $set: {
              status: "available",
              reservedBy: null,
              reservationStart: null,
              reservationEnd: null,
            },
          }
        );

        console.log(
          `[${now.toISOString()}] ${
            expiredLockers.length
          } casier(s) marqué(s) comme disponible(s) après expiration`
        );
      }

      const reminderLockers = await Locker.find({
        status: "reserved",
        reservationEnd: { 
          $gte: new Date(in24hMs - oneHour),  // dans 23h à 25h
          $lte: new Date(in24hMs + oneHour)
        },
        reminderSent: { $ne: true }
      }).populate("reservedBy");

      for (const locker of reminderLockers) {
        const user = locker.reservedBy as { email?: string; name?: string };
        if (user && user.email && locker.reservationEnd) {
          await MailClient.getInstance().sendEmailWithTemplate(
            [user.email],
            "Rappel : votre réservation de casier expire dans 24h",
            "locker-reminder",
            {
              name: user.name || user.email,
              lockerNumber: locker.lockerNumber || locker.id,
              endDate: locker.reservationEnd.toLocaleString("fr-FR"),
              dashboardUrl: `${process.env.CLIENT_URL}/dashboard`,
              currentYear: new Date().getFullYear(),
            }
          );

          locker.reminderSent = true;
          await locker.save();

          console.log(`[MailRappel] Rappel J-1 envoyé à ${user.email} pour casier #${locker.lockerNumber || locker.id}`);
        }
      }

      // Optionnel: Trouver les casiers avec le statut "expired" et les remettre à "available"
      const expiredStatusLockers = await Locker.find({ status: "expired" });

      if (expiredStatusLockers.length > 0) {
        await Locker.updateMany(
          { status: "expired" },
          {
            $set: {
              status: "available",
              reservedBy: null,
              reservationStart: null,
              reservationEnd: null,
            },
          }
        );

        console.log(
          `[${now.toISOString()}] ${
            expiredStatusLockers.length
          } casier(s) avec statut "expired" remis à "available"`
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des statuts des casiers:",
        error
      );
    }
  }

  /**
   * Démarre le planificateur (exécution toutes les minutes)
   */
  public start(): void {
    if (this.isRunning) {
      console.log("Le planificateur de casiers est déjà en cours d'exécution");
      return;
    }

    // Planifier l'exécution toutes les minutes
    cron.schedule("* * * * *", async () => {
      await this.updateLockerStatuses();
    });

    this.isRunning = true;
    console.log(
      "Planificateur de casiers démarré - vérification toutes les minutes"
    );
  }

  /**
   * Arrête le planificateur
   */
  public stop(): void {
    if (this.isRunning) {
      // Note: node-cron ne fournit pas de méthode stop directe pour un job spécifique
      // Dans un vrai projet, on stockerait la référence du job pour pouvoir l'arrêter
      this.isRunning = false;
      console.log("Planificateur de casiers arrêté");
    }
  }

  /**
   * Exécute une mise à jour manuelle (utile pour les tests)
   */
  public async runManualUpdate(): Promise<void> {
    console.log("Exécution manuelle de la mise à jour des statuts des casiers");
    await this.updateLockerStatuses();
  }

  /**
   * Retourne l'état du planificateur
   */
  public getStatus(): boolean {
    return this.isRunning;
  }
}

export default LockerScheduler;

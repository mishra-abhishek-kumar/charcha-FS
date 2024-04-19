const cron = require("cron");
const { moveChats } = require("./cronController");

// Create a cron job to run at midnight (12 AM) every night
const midnightJob = new cron.CronJob(
	"0 0 * * *",
	async () => {
		try {
			console.log("Running cron job...");
			await moveChats();
			console.log("Cron job completed successfully.");
		} catch (error) {
			console.error("Error in cron job:", error);
		}
	},
	null,
	true,
	"UTC"
);

module.exports = { midnightJob };

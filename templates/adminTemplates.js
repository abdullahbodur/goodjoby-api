class AdminMailTemplates {
  static jobAnnouncementTeam(team_name, job_announcement_id) {
    return `<h2>Your Job Announcement Canceled By Us</h2>
      <p>Hello ${team_name},\nThe Job Announcement with the code ${job_announcement_id} was closed by us. If something problem, contact us</p>`;
  }
  static jobAnnouncementApplier(job_announcement_id) {
    return `<h2>Your Applied Job Announcement Canceled By Us</h2>
      <p>Hello !\nThe Job Announcement with the code ${job_announcement_id} was closed by us. If something problem, contact us</p>`;
  }

  static jobApplicationApplier(expertName, application_id) {
    return `<h2>Job Application Canceled By Us</h2>
    <p>Hello ${expertName},The Job Application with the code ${application_id} was closed by us. If something problem, contact us</p>`;
  }

  static pendingWorkOwner(clientName, pendingWorkID) {
    return `<h2>Your Pending Work Canceled By Us</h2>
    <p>Hello ${clientName},\nThe Pending Work with the code ${pendingWorkID} was closed by us. If something problem, contact us</p>`;
  }

  static pendingWorkRequester(pendingWorkID) {
    return `<h2>Your Requested Pending Work Canceled By Us</h2>
<p>Hello !\nThe Pending Work with the code ${pendingWorkID} was closed by us. If something problem, contact us</p>`;
  }

  static workOwner(clientID, work_id) {
    return `<h2>Your Taken Service Canceled By Us</h2>
      <p>Hello ${clientID},\nThe Service with the code ${work_id} was closed by us. If something problem, contact us</p>`;
  }

  static workExpert(expertID, work_id) {
    return `<h2>Work Canceled By Us</h2>
    <p>Hello ${expertID},The job with the code ${work_id} was closed by us. If something problem, contact us</p>`;
  }

  static expertOffer(expertName, offer_id) {
    return `<h2>Your Offfer Canceled By Us</h2>
      <p>Hello ${expertName},The offer with the code ${offer_id} was closed by us. If something problem, contact us</p>`;
  }
}

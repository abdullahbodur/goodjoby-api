class CetTemplates {
  static cancelWork(
    isClient,
    clientName,
    resetPasswordUrl,
    modelName,
    expertName
  ) {
    return isClient
      ? `<h2> Your Work Will Cancel! </h2>
  <p> Your Client ${clientName} has been created a request about cancelling!
  If you aware this happening, You have to click link which is in below.
  Accept link :  <a href= '${resetPasswordUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`
      : `<h2> Your Work Request Will Cancel! </h2>
  <p> Your ${modelName} ${expertName} has been created a request about cancelling!
  If you aware this happening, You have to click link which is in below.
  Accept link :  <a href= '${resetPasswordUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`;
  }

  static upgradeWorkPercent(expertName, finishedUrl) {
    return `<h2> Your Work Request Finished! </h2>
      <p>${expertName} has been finished your work!
      If you are satisfied this service, You have to click link which is in below to accept to finish your work!.
      Accept link :  <a href= '${finishedUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`;
  }

  static cancelJobAnnouncement(job_announcement_id) {
    return `<h2> Your Applied Job Announcement Canceled By Team! </h2>
    <p>Hello! \n
    Your Applied Job Announcement which has code : ${job_announcement_id}, canceled by Team.</p>`;
  }
}

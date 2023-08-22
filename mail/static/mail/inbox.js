document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Passing mail fileds

  document.querySelector('#compose-form').onsubmit  = async (event) => {
    event.preventDefault();
    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value
   
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
      load_mailbox('sent');
  }; 
  return false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  const mailRowContainer = document.querySelector('#emails-view');

  // Show the mailbox name
  
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  if (mailbox === 'inbox') {
    //fetch mails for mailbox
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {

       //create structure for displaying mails

        //loop emails array

      emails.forEach(singlemail => {
        const mailRow = document.createElement('div');
        mailRow.classList.add('mail-row');

        if (!singlemail.read){
          mailRow.classList.add('visited');
        }

        const mailRowL = document.createElement('div');
        mailRowL.classList.add('mail-row-left');

        const mailRowR = document.createElement('div');
        mailRowR.classList.add('mail-row-right');

        const sender = document.createElement('div');
        sender.innerHTML = `From: ${singlemail.sender}`;
        const subject = document.createElement('div');
        subject.innerHTML = singlemail.subject;
        const timestamp = document.createElement('div');
        timestamp.innerHTML = singlemail.timestamp;
        mailRowL.appendChild(sender);
        mailRowL.appendChild(subject);
        mailRowR.appendChild(timestamp);

        mailRow.appendChild(mailRowL);
        mailRow.appendChild(mailRowR);
        mailRowContainer.appendChild(mailRow);
        
      });
      console.log(emails);
  })
}

  else if (mailbox === 'sent') {
        //fetch mails for mailbox
        fetch('/emails/sent')
        .then(response => response.json())
        .then(emails => {

           //create structure for displaying mails

          

            //loop emails array

          emails.forEach(singlemail => {
            const mailRow = document.createElement('div');
            mailRow.classList.add('mail-row');

            const mailRowL = document.createElement('div');
            mailRowL.classList.add('mail-row-left');
  
            const mailRowR = document.createElement('div');
            mailRowR.classList.add('mail-row-right');

            const recipients = document.createElement('div');
            recipients.innerHTML = `to: ${singlemail.recipients.join(", ")}`;
            const subject = document.createElement('div');
            subject.innerHTML = singlemail.subject;
            const timestamp = document.createElement('div');
            timestamp.innerHTML = singlemail.timestamp;
            mailRowL.appendChild(recipients);
            mailRowL.appendChild(subject);
            mailRowR.appendChild(timestamp);

            mailRow.appendChild(mailRowL);
            mailRow.appendChild(mailRowR);
            mailRowContainer.appendChild(mailRow);
            
          });
          console.log(emails);
      })
  }
  else {
          //fetch mails for mailbox
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      emails.array.forEach(singlemail => {
        const mail = document.createElement('div');
        mail.innerHTML = singlemail.sender;
        document.querySelector('#emails-view').append(mail);
      });
      console.log(emails);

      // ... do something else with emails ...
  });
}
}
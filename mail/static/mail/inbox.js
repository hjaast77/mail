document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
    // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(mail = null) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  console.log(mail);

  if (mail){
    // Set values only if mail is provided
    document.querySelector('#compose-recipients').value = mail.sender || '';
    document.querySelector('#compose-subject').value = mail.subject ? (mail.subject.startsWith('Re:') ? mail.subject : `Re: ${mail.subject}`) : '';
    document.querySelector('#compose-body').value = mail.timestamp ? `On ${mail.timestamp}, ${mail.sender} wrote:\n${mail.body}` : '';
  } else {
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }

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
    setTimeout(() => {
      load_mailbox('sent');
  }, 500);
  }; 
  return false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';
  const mailRowContainer = document.querySelector('#emails-view');

  // Show the mailbox name
  
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  if (mailbox === 'inbox') {
    //fetch mails for mailbox
    fetch('/emails/inbox')
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
        mailRow.addEventListener('click', () => load_mail(singlemail.id));
        
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

    //fetch mails for mailbox
    fetch('/emails/archive')
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
        mailRow.addEventListener('click', () => load_mail(singlemail.id));
        
      });
      console.log(emails);
    })
    
}
}

function load_mail(id){

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  const mailContainer = document.querySelector('#email-detail');
  //delete previous mails
   while (mailContainer.firstChild) {
    mailContainer.removeChild(mailContainer.firstChild);
  }
 
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  mailContainer.style.display = 'block';
  
  
  //hide all mails
  
  //fetch selected mail
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    
    //print headings

    const fieldOrder = ['sender', 'recipients', 'subject', 'timestamp'];

    for (const field of fieldOrder) {
      const heading = document.createElement('div');
      heading.classList.add('mail-heading');
      const label = document.createElement('div');
      label.classList.add('bold-text')
      label.textContent = `${getFieldLabel(field)}: `;
      const value = document.createElement('span');
      value.textContent = email[field];

      heading.appendChild(label);
      heading.appendChild(value);
      mailContainer.appendChild(heading);
}
      function getFieldLabel(field) {
        switch (field) {
          case 'sender':
            return 'From';
          case 'recipients':
            return 'To';
          case 'subject':
            return 'Subject';
          case 'timestamp':
            return 'Timestamp';
          default:
            return field;
        }
}
const buttonLine = document.createElement('div');
buttonLine.classList.add('but-line');
const reply = document.createElement('button');
reply.classList.add('btn', 'btn-sm', 'btn-outline-primary');
reply.textContent = 'Reply';

const archButton = document.createElement('button');
archButton.classList.add('btn', 'btn-sm', 'btn-outline-primary');
if (email.archived){
  archButton.textContent = 'Unarchive'
 } else {
  archButton.textContent = 'Archive'
}

reply.addEventListener('click', () => compose_email(email));
  

archButton.addEventListener('click', function() {
  if (email.archived){
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }else{
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
});


buttonLine.appendChild(reply);
buttonLine.appendChild(archButton);
mailContainer.appendChild(buttonLine);
const line = document.createElement('hr')
mailContainer.appendChild(line);

const body = document.createElement('div');
body.innerHTML = email.body;
mailContainer.appendChild(body);
 
    console.log(email);

    // ... do something else with email ...
});
  console.log(id)

} 
const sgMail = require('@sendgrid/mail')

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmails = (email,name)=>{
    sgMail.send({
        to : email,
        from : 'shubhu.singh610@gmail.com',
        subject : 'Welcome Mail',
        text  : `Welcome to the App, ${name} .Let me know what's up`,
      


    }) 

}

const sendCancellationmails = (email,name)=>{
    sgMail.send({
        to : email,
        from : 'shubhu.singh610@gmail.com',
        subject : 'GoodBye Mail',
        text  : `It was good knowing You, ${name} .Let me know what could we have done to keep you here.`,
      


    }) 

}

module.exports = {
    sendWelcomeEmails ,
    sendCancellationmails   
}

// sgMail.send({
//     to: 'shubhu.singh610@gmail.com',
//     from : 'shubhu.singh610@gmail.com',
//     subject : 'test mail',
//     text : 'Test mail body'
// }).catch(err => {
//     console.log(err)
// })



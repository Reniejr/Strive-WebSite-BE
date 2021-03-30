const sgMail = require("@sendgrid/mail"),
  { layerBottom, layerTop } = require("./emailContents");

const eMail = (receiver, sender, subject, text) => {
  const emailContent = {
    to: receiver,
    from: sender,
    subject: subject,
    //   html: `
    //     <div style="position: absolute; top: 0; width: 100%;">
    //       <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/6f303a33-f59e-4acd-a30b-6f49c0a333be/1369x427.png" alt="" style="width: 100%; height: 150px; transform: rotateX(180deg); position: absolute; top:0; z-index:-1;"/>
    //       <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/be69b44b-4f96-4601-8867-e3382d6cd70a/890x250.png" alt="" style="width: 100px; position: absolute; top: 30px; right: 5px; z-index:1;"/>
    //         </div>
    //         Hello and Welcome to Strive School,
    // Please sign-in to our official website to monitor your achievements and todo lists during our course.
    // Here we provide you a temporarily password, please change it after the sign-in:
    //     ${text}
    //         <div style="position: absolute; bottom: 0; width:100%;">
    //   <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/6f303a33-f59e-4acd-a30b-6f49c0a333be/1369x427.png" alt="" style="width: 100%; height: 150px; transform: rotateY(180deg); position: absolute; bottom:0; z-index:-1;"/>
    //   <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/8c6460dc-b59b-4e94-b208-38d609ea3dd6/200x200.png" alt="" style="width: 75px; height:75px; border-radius: 50%; position: absolute; bottom: 10px; left: 20px;"/>
    //    </div>
    //     `,
    templateId: "d-22fc8a4e3a044422b9870713e2e9d801",
    dynamic_template_data: {
      subject: subject,
      name: "Welcome to Strive School",
      text: `Hello and Welcome to Strive School,
        Please sign-in to our official website to monitor your achievements and todo lists during our course.
        Here we provide you a temporarily password, please change it after the sign-in:
        ${text}`,
    },
  };
  return emailContent;
};

const welcomeMsg = (pwd) => {
  return `
  Hello and Welcome to Strive School,
  Please sign-in to our official website to monitor your achievements and todo lists during our course.
  Here we provide you a temporarily password, please change it after the sign-in:
  ${pwd}
  `;
};

const rejectMsg = () => {
  return `Hello from Strive School,
  We are sorry, but you did not reach the require points in the Admission Test.
  `;
};

module.exports = { eMail, welcomeMsg, rejectMsg };

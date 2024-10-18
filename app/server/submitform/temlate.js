const htmlContent = (data) => `
<table style="width: 100%; border-spacing: 0px; border: 0px; border-collapse: collapse;">
  <tr id="logo" style="height: 150px;">
    <td style="width: 15%; background-color: white; border: 0px; border-collapse: collapse;"></td>
    <td style="width: 70%; background-color: white; text-align: center; border: 0px; border-collapse: collapse;">
      <img src="https://www.innovativemedicalwellness.com/logo-long.png" alt="Innovative Wellness logo" style="margin:0; width: 450px; height: auto;"/>
    </td>
    <td style="width: 15%; background-color: white; border: 0px; border-collapse: collapse;"></td>
  </tr>
  <tr id="contentHeader">
    <td style="width: 15%; background-color: white; border: 0px; border-collapse: collapse;"></td>
    <td style="width: 70%; background-color: #0A5B99; color:white; border-radius:25px 25px 0 0; padding-top: 10px; padding-left: 10px; padding-right: 10px; border: 0px; border-collapse: collapse;">
      <h3 style="text-align: center;padding:10px ">New Form Notification</h3>
      <hr style="width: 70%; text-align: center;margin-top:0">
      <h4 style="text-align: center; ">Congratulations!</h4>
      <br />
    </td>
    <td style="width: 15%; background-color: white; border: 0px; border-collapse: collapse;"></td>
  </tr>
  <tr id="content">
    <td style="width: 15%; background-color: #FFFFFC; border: 0px; border-collapse: collapse;"></td>
    <td style="width: 70%; background-color: #0A5B99; color:white; padding: 10px; border: 0px; border-collapse: collapse;">
      <p>A new form has been submitted!</p>
      <p><strong>Course Name:</strong><br />
        ${data.fullname}
      </p>
      <p><strong>Email:</strong><br />
        ${data.email}
      </p>
      <p><strong>Message:</strong><br />
        ${data.message}
      </p>
      <p><strong>Created At:</strong><br />
        ${data.createdAt}
      </p>
      <p>Thank you<br />
      </p>
      <br />
    </td>
    <td style="width: 15%; background-color: #FFFFFC; border: 0px; border-collapse: collapse;"></td>
  </tr>
  <tr id="footer">
    <td style="width: 15%; background-color: #FFFFFC; font-family: sans-serif; border: 0px; border-collapse: collapse;"></td>
    <td style="width: 70%;  overflow: hidden; background-color: #DDE3E3; border-radius: 0 0 25px 25px; border: 0px; border-collapse: collapse;">
      <p style="font-size: 12px; padding: 5px 0 5px 15px ; font-family: 'Arial', sans-serif;">
	  Build by:
	  </p>
	  <div style=" color: black; padding: 0 15px;display: flex; align-items: center; justify-content: flex-start;">
        <a href="https://myababeel.com" target="_blank" style="margin-right: 10px; text-decoration: none;">
          <img src="https://myababeel.com/logo.svg" alt="MyAbabeel Logo" style="width: 60px; height: auto;"/>
        </a>
        <div style="text-align: left;">
          <a href="https://myababeel.com" target="_blank" style="color: #006161; text-decoration: none;font-weight:600;letter-spacing:1px; font-size: 22px; font-family: 'Arial', sans-serif;">MyAbabeel</a><br />
          <span style="font-size: 14px; font-family: 'Arial', sans-serif;">Design, Develop and Optimize</span>
        </div>
      </div>
      <div style="text-align: center;background-color:#E9EDED;padding:10px 4px; margin: 20px 3px 3px; border-radius: 0 0 22.5px 22.5px; ">
        <a href="https://wa.me/923172047047?text=Greetings!%20I%20have%20an%20interesting%20collaboration%20proposal.%20Are%20you%20open%20to%20discussing%20potential%20projects%20together?" target="_blank" style="margin: 0 5px;text-decoration:none;">
          <img src="https://myababeel.com/svg/whatsapp.svg" alt="WhatsApp" style="width: auto; height: 22px; "/>
        </a>
        <a href="https://www.linkedin.com/in/chauhdri" target="_blank" style="margin: 0 5px;text-decoration:none;">
          <img src="https://myababeel.com/svg/linkedin.svg" alt="LinkedIn" style="width: auto; height: 22px;"/>
        </a>
        <a href="https://www.facebook.com/myababeel.posts/" target="_blank" style="margin: 0 5px;text-decoration:none;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style="width: auto; height: 20px;"/>
        </a>
        <a href="https://github.com/Chauhdri" target="_blank" style="margin: 0 5px;text-decoration:none;">
          <img src="https://myababeel.com/svg/github.svg" alt="GitHub" style="width: auto; height: 20px;"/>
        </a>
        <a href="mailto:services@myababeel.com" style="margin: 0 5px;text-decoration:none;">
          <img src="https://myababeel.com/svg/email.svg" alt="Email" style="width: auto; height: 20px; "/>
        </a>
      </div>
    </td>
    <td style="width: 15%; background-color: #FFFFFC; border: 0px; border-collapse: collapse;"></td>
  </tr>
  <tr id="endTable">
    <td style="width: 15%; background-color: #FFFFFC; border: 0px; padding: 12px; border-collapse: collapse;"></td>
    <td style="width: 70%; background-color: #FFFFFC; border: 0px; padding: 12px; border-collapse: collapse;"></td>
    <td style="width: 15%; background-color: #FFFFFC; border: 0px; padding: 12px; border-collapse: collapse;"></td>
  </tr>
</table>
`;

export default htmlContent;

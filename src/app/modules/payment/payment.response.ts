export const htmlPaymentSuccessContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4CAF50;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content h2 {
        color: #333;
      }
      .content p {
        margin: 15px 0;
      }
      .content .info {
        margin: 20px 0;
      }
      .info div {
        margin-bottom: 10px;
      }
      .footer {
        background-color: #f1f1f1;
        color: #777;
        text-align: center;
        padding: 10px;
        font-size: 14px;
      }
      .footer a {
        color: #4CAF50;
        text-decoration: none;
      }
      .btn-home {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        background-color: #4CAF50;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
      }
      .btn-home:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Payment Confirmation
      </div>
      <div class="content">
        <h2>Thank you for your payment!</h2>
        <p>We have successfully received your payment.</p>
        <p>If you have any questions about your payment or need further assistance, please do not hesitate to contact us.</p>
        <p>Thank you for choosing our service.</p>
        <a href="http://localhost:5173" target="_blank" class="btn-home">Go Home</a>
      </div>
    </div>
  </body>
  </html>
`;

export const htmlPaymentFailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #e74c3c;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .content h2 {
      color: #333;
    }
    .content p {
      margin: 15px 0;
    }
    .footer {
      background-color: #f1f1f1;
      color: #777;
      text-align: center;
      padding: 10px;
      font-size: 14px;
    }
    .footer a {
      color: #e74c3c;
      text-decoration: none;
    }
       .btn-home {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: white;
      background-color: #4CAF50;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .btn-home:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Payment Failed
    </div>
    <div class="content">
      <h2>We're sorry, your payment could not be processed.</h2>
      <p>Dear Customer,</p>
      <p>Unfortunately, your payment could not be completed. Please try again or contact our support team for assistance.</p>
      <p>If you have any questions or need further help, please don't hesitate to reach out to our support team.</p>
      <p>Thank you for your understanding.</p>
       <a href="http://localhost:5173" target="_blank"  class="btn-home">Go Home</a>
    </div>
    <div class="footer">
      <p>&copy; 2024 Fast Bike. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const htmlPaymentSuccessContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Content Payment Confirmation</title>
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
        Premium Content Payment Confirmation
      </div>
      <div class="content">
        <h2>Thank you for your payment!</h2>
        <p>Your payment for premium content has been successfully processed.</p>
        <p>You can now access your purchased posts under the "Purchased Posts" section in your profile.</p>
        <p>If you have any questions about your payment or need further assistance, please feel free to contact us.</p>
        <p>Thank you for choosing our service. Enjoy your premium content!</p>
        <a href="https://eyebook.vercel.app/" target="_blank" class="btn-home">Go Home</a>
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
  <title>Premium Content Payment Failed</title>
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
    .btn-home {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: white;
      background-color: #e74c3c;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .btn-home:hover {
      background-color: #d43f33;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Premium Content Payment Failed
    </div>
    <div class="content">
      <h2>We're sorry, your payment could not be processed.</h2>
      <p>Unfortunately, your payment for premium content was unsuccessful. Please try again or contact our support team for assistance.</p>
      <p>If you need further help, feel free to reach out to our support team. We are here to assist you.</p>
      <a href="https://eyebook.vercel.app/" target="_blank" class="btn-home">Go Home</a>
    </div>
    <div class="footer">
      <p>&copy; 2024 Fast Bike. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

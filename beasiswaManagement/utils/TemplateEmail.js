const TemplateEmail = (content) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .container {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #2c5297;
      padding: 20px;
    }

    .card {
      padding: 20px;
      border-radius: 4px;
      background-color: white;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <h3>UNIVERSITAS PRAMITA INDONESIA</h3>
      <p>${content}</p>
    </div>
  </div>
</body>

</html>`;
};

export default TemplateEmail;

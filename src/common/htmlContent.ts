export const htmlContentPaymentSuccess = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Open Sans', sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            padding: 16px;
        }

        .checkDone {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 32px;
            flex: 1;
        }

        .textCheckDone {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            color: #FC9600;
            font-weight: bold;
        }

        .textThanks {
            font-family: 'Open Sans', sans-serif;
            font-size: 18px;
            color: #2A4D50; 
            text-align: center;
            font-weight: 600;
        }

        .buttonWrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
        }

        button {
            width: 60%;
            padding: 10px;
            font-size: 16px;
            background-color: #FC9600;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="checkDone">
            <p class="textCheckDone">Gia hạn thành công !</p>
            <ion-icon name="checkmark-circle-outline" style="font-size: 250px; color: green;"></ion-icon>
        </div>
        <div class="buttonWrapper">
            <button onclick="backToHome()">Về trang chủ</button>
        </div>
    </div>

    <script>
        function backToHome() {
            window.ReactNativeWebView.postMessage("backToHome");
        }
    </script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</body>
</html>
`;

export const htmlContentPaymentFail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Open Sans', sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            padding: 16px;
        }

        .faild {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 32px;
            flex: 1;
        }

        .textFaild {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            color: #FC9600;
            font-weight: bold;
        }

        .buttonWrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
        }

        button {
            width: 60%;
            padding: 10px;
            font-size: 16px;
            background-color: #FC9600;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="faild">
            <p class="textFaild">Gia hạn thất bại !</p>
            <ion-icon name="close-outline" style="font-size: 250px; color: red;"></ion-icon>
        </div>
        <div class="buttonWrapper">
            <button onclick="backToHome()">Về trang chủ</button>
        </div>
    </div>

    <script>
        function backToHome() {
            window.ReactNativeWebView.postMessage("backToHome");
        }
    </script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</body>
</html>
`;

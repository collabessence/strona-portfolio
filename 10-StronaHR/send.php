<?php
// Konfiguracja
$recipient_email = "kontakt@stronahr.pl"; // ZMIEŃ NA SWÓJ ADRES EMAIL
$subject_prefix = "[STRONAHR] Nowa wiadomość z formularza kontaktowego";
$success_message = "Dziękujemy! Wiadomość została wysłana pomyślnie.";
$error_message = "Przepraszamy, wystąpił błąd podczas wysyłania wiadomości.";

// Funkcja do czyszczenia danych wejściowych
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Funkcja do walidacji email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Funkcja do walidacji długości tekstu
function validate_length($text, $min = 2, $max = 1000) {
    $length = strlen($text);
    return $length >= $min && $length <= $max;
}

// Obsługa żądania POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Pobieranie i czyszczenie danych z formularza
    $name = isset($_POST['name']) ? clean_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? clean_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? clean_input($_POST['phone']) : '';
    $service = isset($_POST['service']) ? clean_input($_POST['service']) : '';
    $message = isset($_POST['message']) ? clean_input($_POST['message']) : '';
    $consent = isset($_POST['consent']) ? true : false;
    $marketing = isset($_POST['marketing']) ? true : false;
    
    // Honeypot check - jeśli pole "website" jest wypełnione, to bot
    $honeypot = isset($_POST['website']) ? $_POST['website'] : '';
    if (!empty($honeypot)) {
        // Bot detected - return fake success but don't send email
        $response = array(
            'status' => 'success',
            'message' => $success_message
        );
        header('Content-Type: application/json');
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $errors = array();
    
    // Walidacja zgody RODO
    if (!$consent) {
        $errors[] = "Musisz wyrazić zgodę na przetwarzanie danych osobowych.";
    }
    
    // Walidacja danych
    if (empty($name)) {
        $errors[] = "Imię i nazwisko jest wymagane.";
    } elseif (!validate_length($name, 2, 50)) {
        $errors[] = "Imię i nazwisko musi mieć od 2 do 50 znaków.";
    }
    
    if (empty($email)) {
        $errors[] = "Adres email jest wymagany.";
    } elseif (!validate_email($email)) {
        $errors[] = "Podaj prawidłowy adres email.";
    }
    
    if (empty($message)) {
        $errors[] = "Wiadomość jest wymagana.";
    } elseif (!validate_length($message, 10, 1000)) {
        $errors[] = "Wiadomość musi mieć od 10 do 1000 znaków.";
    }
    
    // Mapowanie usług
    $services = array(
        'hr' => 'Usługi HR',
        'szkolenia' => 'Szkolenia Sprzedażowe',
        'mentoring' => 'Mentoring',
        'inne' => 'Inne'
    );
    
    $service_name = isset($services[$service]) ? $services[$service] : 'Nie wybrano';
    
    // Jeśli brak błędów, wysyłaj email
    if (empty($errors)) {
        
        // Przygotowanie treści email
        $email_subject = $subject_prefix . " - " . $service_name;
        
        $email_body = "=== Nowa wiadomość z formularza kontaktowego ===\n\n";
        $email_body .= "Imię i nazwisko: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n";
        
        if (!empty($phone)) {
            $email_body .= "Telefon: " . $phone . "\n";
        }
        
        $email_body .= "Usługa: " . $service_name . "\n";
        $email_body .= "Data: " . date('Y-m-d H:i:s') . "\n";
        $email_body .= "Zgoda RODO: Tak\n";
        if ($marketing) {
            $email_body .= "Zgoda marketingowa: Tak\n";
        }
        $email_body .= "\n";
        $email_body .= "Wiadomość:\n" . $message . "\n\n";
        $email_body .= "=== Koniec wiadomości ===\n";
        $email_body .= "Ta wiadomość została wysłana z formularza na stronie STRONAHR.";
        
        // Nagłówki email
        $headers = array();
        $headers[] = 'From: noreply@stronahr.pl';
        $headers[] = 'Reply-To: ' . $email;
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        
        // Wysyłanie email
        $mail_sent = mail($recipient_email, $email_subject, $email_body, implode("\r\n", $headers));
        
        if ($mail_sent) {
            // Sukces
            $response = array(
                'status' => 'success',
                'message' => $success_message
            );
        } else {
            // Błąd wysyłania
            $response = array(
                'status' => 'error',
                'message' => 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'
            );
        }
        
    } else {
        // Błędy walidacji
        $response = array(
            'status' => 'error',
            'message' => 'Błędy w formularzu:',
            'errors' => $errors
        );
    }
    
    // Zwracanie odpowiedzi jako JSON
    header('Content-Type: application/json');
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// Jeśli nie POST, przekieruj na stronę główną
header('Location: index.html');
exit;
?>

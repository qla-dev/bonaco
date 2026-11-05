<?php
/**
 * Kontakt forma (POST JSON iz components/ContactForm.tsx).
 * Šalje upit na Bonaco email i potvrdu pošiljaocu. Zaštita: honeypot, osnovni rate limit, validacija.
 */
declare(strict_types=1);

const TO = 'bonacomedia@gmail.com';
const FROM = 'Bonaco Media <noreply@bonacomedia.com>'; // adresa mora biti na domenu servera (SPF)
const MAX_PER_HOUR = 5;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'Metoda nije dozvoljena.']);

$data = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($data)) reply(400, ['ok' => false, 'error' => 'Neispravan zahtjev.']);

// Honeypot: botovi popune skriveno polje; tiho "uspješno" da ne pokušavaju ponovo.
if (!empty($data['website'])) reply(200, ['ok' => true]);

$clean = static fn ($v, int $max) => trim(mb_substr(str_replace(["\r", "\0"], '', (string) ($v ?? '')), 0, $max));
$name = $clean($data['name'] ?? '', 120);
$company = $clean($data['company'] ?? '', 120);
$email = $clean($data['email'] ?? '', 160);
$phone = $clean($data['phone'] ?? '', 40);
$budget = $clean($data['budget'] ?? '', 60);
$message = $clean($data['message'] ?? '', 5000);
$services = array_slice(array_map(fn ($s) => $clean($s, 60), is_array($data['services'] ?? null) ? $data['services'] : []), 0, 10);

if ($name === '' || $message === '' || !$services) reply(422, ['ok' => false, 'error' => 'Popunite ime, uslugu i poruku.']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(422, ['ok' => false, 'error' => 'Email adresa nije ispravna.']);
if (empty($data['consent'])) reply(422, ['ok' => false, 'error' => 'Potrebna je saglasnost za obradu podataka.']);

// Rate limit po IP adresi (fajl u temp folderu)
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', $ip)[0]);
$bucket = sys_get_temp_dir() . '/bonaco-contact-' . hash('sha256', $ip);
$hits = array_filter(is_file($bucket) ? (array) json_decode((string) file_get_contents($bucket), true) : [], fn ($t) => $t > time() - 3600);
if (count($hits) >= MAX_PER_HOUR) reply(429, ['ok' => false, 'error' => 'Previše upita u kratkom roku. Pokušajte kasnije ili nas nazovite.']);
$hits[] = time();
file_put_contents($bucket, json_encode(array_values($hits)), LOCK_EX);

$enc = static fn (string $s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
$headers = static fn (string $replyTo) => implode("\r\n", [
    'From: ' . FROM,
    'Reply-To: ' . $replyTo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$lines = [
    "Novi upit sa bonacomedia.com",
    "",
    "Ime: $name",
    $company !== '' ? "Firma: $company" : null,
    "Email: $email",
    $phone !== '' ? "Telefon: $phone" : null,
    "Usluge: " . implode(', ', $services),
    $budget !== '' ? "Budžet: $budget" : null,
    "",
    "Poruka:",
    $message,
];
$body = implode("\n", array_filter($lines, fn ($l) => $l !== null));

$sent = mail(TO, $enc('Upit: ' . implode(', ', $services) . ' – ' . $name), $body, $headers($email));
if (!$sent) reply(500, ['ok' => false, 'error' => 'Slanje trenutno ne radi.']);

// Potvrda pošiljaocu (ne blokira uspjeh ako ne prođe)
$confirm = "Poštovani/a $name,\n\nhvala na upitu. Primili smo vašu poruku i javit ćemo vam se u najkraćem roku.\n\nVaš upit:\n" .
    "Usluge: " . implode(', ', $services) . "\n\n$message\n\n--\nBonaco Media\nHiseta br. 11, 71000 Sarajevo\n+387 33 258 900\nhttps://bonacomedia.com";
@mail($email, $enc('Primili smo vaš upit – Bonaco Media'), $confirm, $headers(TO));

reply(200, ['ok' => true]);

<?php

namespace App\Helpers;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;

class Formatter
{
  public static function formatPhoneNumber(?string $phone): ?string
  {
    if (is_null($phone) || $phone === '') {
      return null;
    }

    $phoneNumberUtil = PhoneNumberUtil::getInstance();
    $normalized = preg_replace('/[^0-9+]/', '', $phone);
    if (str_starts_with($normalized, '62') && !str_starts_with($normalized, '+')) {
      $normalized = '+' . $normalized;
    }
    $region = str_starts_with($normalized, '+') ? null : 'ID';
    try {
      $phoneNumberObject = $phoneNumberUtil->parse($normalized, $region);
      return $phoneNumberUtil->format($phoneNumberObject, PhoneNumberFormat::E164);
    } catch (NumberParseException $e) {
      return $phone; // fallback
    }
  }
}

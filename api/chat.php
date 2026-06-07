<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed. Use POST request."
    ]);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($message)) {
    echo json_encode([
        "success" => true,
        "response" => "नमस्ते! मैं स्वस्तिका सहायक हूँ। आप मुझसे हमारे कंक्रीट उत्पादों, कीमतों, डिलीवरी समय या बुकिंग के बारे में पूछ सकते हैं।"
    ]);
    exit;
}

// Convert user message to lowercase for matching
$text = mb_strtolower($message, 'UTF-8');

// Keyword analysis and response generation
$response = '';

if (preg_match('/(hi|hello|hey|नमस्ते|प्रणाम|राम राम|राधे)/u', $text)) {
    $response = "नमस्ते! स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ? (Hello! Welcome to Swastika Interlocking. How can I help you today?)";
} 
else if (preg_match('/(price|cost|दर|भाव|रुपया|मूल्य|कितने का)/u', $text)) {
    $response = "हमारे उत्पादों की मूल्य सीमा निम्न प्रकार है:\n" .
                "- इंटरलॉकिंग पेवर ब्लॉक: ₹45 से ₹85 प्रति वर्ग फीट\n" .
                "- सीमेंट (ग्रेड 53): ₹380 से ₹450 प्रति बैग\n" .
                "- नदी की रेत ( washed sand): ₹2,800 से ₹3,500 प्रति ट्रक\n" .
                "- कुचला हुआ पत्थर/गिट्टी: ₹1,200 से ₹1,800 प्रति टन\n" .
                "- खोखले ब्लॉक: ₹35 से ₹55 प्रति नग\n" .
                "सटीक कोटेशन के लिए कृपया ऊपर 'ऑर्डर बुक करें' (Book Order) पर क्लिक करें।";
} 
else if (preg_match('/(paver|block|पेवर|ब्लॉक|पथर|पत्थर)/u', $text)) {
    $response = "हम विभिन्न प्रकार के उच्च-गुणवत्ता वाले पेवर ब्लॉक बनाते हैं:\n" .
                "1. I-Shape Paver (औद्योगिक/भारी वाहनों के लिए)\n" .
                "2. Zig-Zag Paver (व्यावसायिक मार्ग/सड़कों के लिए)\n" .
                "3. Trihex Blocks (सुंदर बगीचों/पैदल पथ के लिए)\n" .
                "4. Grass Paver (हरियाली और पार्किंग के लिए)\n" .
                "आप हमारे 'उत्पाद' (Products) पृष्ठ पर इनकी मोटाई और विवरण देख सकते हैं।";
} 
else if (preg_match('/(cement|सीमेंट)/u', $text)) {
    $response = "हम निर्माण के लिए ग्रेड 53 (Grade 53 OPC/PPC) प्रीमियम ब्रांडेड सीमेंट प्रदान करते हैं। यह उच्च मजबूती और टिकाऊपन सुनिश्चित करता है। इसकी कीमत ₹380 - ₹450 प्रति बैग के बीच है।";
} 
else if (preg_match('/(sand|रेत|धूल|बालू)/u', $text)) {
    $response = "हम प्लास्टर और कंक्रीट मिक्स के लिए उपयुक्त, मिट्टी-मुक्त तीन बार धुली हुई नदी की सुनहरी रेत (Fine River Sand) प्रदान करते हैं। इसकी कीमत लगभग ₹2,800 - ₹3,500 प्रति ट्रक है।";
} 
else if (preg_match('/(gravel|stone|गिट्टी|पत्थर|रोड़ी)/u', $text)) {
    $response = "हम कंक्रीट ढलाई और सड़क निर्माण के लिए 10mm, 20mm और 40mm आकार के कुचले हुए नीले-ग्रे पत्थर/गिट्टी (Aggregate Stones) की आपूर्ति करते हैं। कीमत ₹1,200 से ₹1,800 प्रति टन है।";
} 
else if (preg_match('/(delivery|time|समय|डिलिवरी|कब)/u', $text)) {
    $response = "ऑर्डर की पुष्टि होने के बाद, सामान्य तौर पर डिलीवरी में 3 से 5 कार्य दिवस (Working Days) का समय लगता है। भारी डिलीवरी के लिए हमारे पास अपना खुद का मालवाहक वाहन नेटवर्क है।";
} 
else if (preg_match('/(order|book|buy|खरीद|बुक)/u', $text)) {
    $response = "ऑर्डर बुक करना बहुत आसान है! आप हमारे मेनू में जाकर 'ऑर्डर बुक करें' (Book Order) बटन पर क्लिक कर सकते हैं, या सीधे '/#/order' मार्ग पर जा सकते हैं और फॉर्म भरकर सबमिट कर सकते हैं। हमारा प्रतिनिधि कॉल कर आपका ऑर्डर फाइनल करेगा।";
} 
else if (preg_match('/(contact|phone|number|call|support|कॉल|फ़ोन|नंबर|पता|ओखला)/u', $text)) {
    $response = "आप हमसे निम्न प्रकार संपर्क कर सकते हैं:\n" .
                "- फ़ोन: +91 98765 43210 / +91 11 2345 678\n" .
                "- ईमेल: sales@swastikainterlocking.com\n" .
                "- पता: प्लॉट 42, औद्योगिक क्षेत्र फेज II, ओखला, नई दिल्ली - 110020\n" .
                "या आप WhatsApp बटन पर क्लिक कर हमसे तुरंत लाइव चैट कर सकते हैं।";
} 
else {
    $response = "धन्यवाद! स्वस्तिका इंटरलॉकिंग के बारे में आपके प्रश्न को समझने में मुझे थोड़ी समस्या हुई। कृपया कीमतों, उत्पादों (पेवर ब्लॉक, सीमेंट, रेत, गिट्टी, निकासी पाइप) या ऑर्डर बुक करने के बारे में पूछें।";
}

echo json_encode([
    "success" => true,
    "response" => $response
]);
?>

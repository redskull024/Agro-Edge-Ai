import { Message } from "@/components/ChatInterface";

interface DialogueResponse {
  keywords: string[];
  responses: string[];
  location?: string;
}

interface LocationData {
  name: string;
  climate: string;
  season: string;
  commonCrops: string[];
}

interface LanguageData {
  code: string;
  name: string;
  nativeName: string;
}

interface TranslatedResponse {
  en: string[];
  es: string[];
  fr: string[];
  pt: string[];
  hi: string[];
}

class DialogueSystem {
  private currentLanguage: string = "en";
  
  private languages: LanguageData[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" }
  ];

  private currentLocation: LocationData = {
    name: "Central Valley, California",
    climate: "Mediterranean",
    season: "Late Summer",
    commonCrops: ["tomatoes", "lettuce", "corn", "peppers"]
  };

  private locations: LocationData[] = [
    {
      name: "Central Valley, California",
      climate: "Mediterranean",
      season: "Late Summer",
      commonCrops: ["tomatoes", "lettuce", "corn", "peppers"]
    },
    {
      name: "Iowa Midwest",
      climate: "Continental",
      season: "Late Summer",
      commonCrops: ["corn", "soybeans", "wheat", "oats"]
    },
    {
      name: "Florida Gulf Coast",
      climate: "Subtropical",
      season: "Growing Season",
      commonCrops: ["citrus", "tomatoes", "peppers", "strawberries"]
    },
    {
      name: "Pacific Northwest",
      climate: "Oceanic",
      season: "Harvest Time",
      commonCrops: ["apples", "berries", "leafy greens", "potatoes"]
    }
  ];

  private locationSpecificTips: Record<string, DialogueResponse[]> = {
    "Central Valley, California": [
      {
        keywords: ["growth", "tips", "advice", "help"],
        responses: [
          "With this Mediterranean climate, your crops love the warm days and cool nights! For your tomatoes, morning watering is crucial here - it helps them handle the afternoon heat better.",
          "In the Central Valley, watch out for powdery mildew on your crops. The dry air helps, but good air circulation between plants is key. Space them well!",
          "Perfect weather for peppers right now! They thrive in this heat. Just make sure to keep soil moisture consistent - these clay soils can crack when they dry out."
        ]
      },
      {
        keywords: ["weather", "temperature", "heat"],
        responses: [
          "Classic Central Valley weather - hot and dry! Your crops are adapted to this, but watch water levels closely. The valley heat can be intense.",
          "This Mediterranean climate is perfect for your summer crops. Just remember, when temps hit 35°C+, provide afternoon shade for sensitive plants like lettuce."
        ]
      }
    ],
    "Iowa Midwest": [
      {
        keywords: ["growth", "tips", "advice", "help"],
        responses: [
          "Your corn is looking great! In Iowa, this is prime growing season. Watch for corn borers - they're common here in late summer. Crop rotation with soybeans next season will help soil health.",
          "The humid continental climate here is perfect for your soybeans right now. They're filling pods beautifully! Keep an eye on white mold - the humidity can encourage it.",
          "With Iowa's rich soil, your crops have everything they need. Just watch drainage after heavy rains - these prairie soils can get waterlogged quickly."
        ]
      },
      {
        keywords: ["weather", "rain", "humidity"],
        responses: [
          "Typical Midwest weather patterns! The humidity is great for corn and soybeans. If storms are coming, check for hail damage on leaves after they pass.",
          "This continental climate gives you those perfect growing degree days. Your corn is loving the warm, humid conditions right now."
        ]
      }
    ],
    "Florida Gulf Coast": [
      {
        keywords: ["growth", "tips", "advice", "help"],
        responses: [
          "Your citrus trees are thriving in this subtropical climate! Watch for citrus canker during humid periods - good air circulation is crucial here.",
          "Perfect growing weather for peppers and tomatoes! The warmth and humidity are ideal. Just watch for late blight on tomatoes - it spreads fast in this climate.",
          "Your strawberries are doing well for this time of year! In Florida, they prefer the cooler morning hours. Consider shade cloth during the hottest part of the day."
        ]
      },
      {
        keywords: ["weather", "humidity", "heat"],
        responses: [
          "Classic Gulf Coast weather - warm and humid! Your tropical and subtropical crops love this. Just ensure good ventilation to prevent fungal issues.",
          "The subtropical climate here means year-round growing! Perfect for your citrus. Watch for afternoon thunderstorms - they can bring beneficial rain but also strong winds."
        ]
      }
    ],
    "Pacific Northwest": [
      {
        keywords: ["growth", "tips", "advice", "help"],
        responses: [
          "Your apple trees are entering harvest season! This oceanic climate with cool, moist air is perfect for them. Watch for apple scab during wet periods.",
          "The berries are loving this climate! Cool temperatures and regular moisture are ideal. Your blueberries should be finishing up their harvest soon.",
          "Perfect weather for leafy greens! They thrive in this cool, moist Pacific climate. Just watch for slug damage - they're common here in damp conditions."
        ]
      },
      {
        keywords: ["weather", "rain", "moisture"],
        responses: [
          "Typical Pacific Northwest weather! The consistent moisture is great for your crops. Your potatoes especially love this cool, damp climate.",
          "This oceanic climate provides steady growing conditions. Perfect for your berries and apples! Just ensure good drainage to prevent root rot."
        ]
      }
    ]
  };

  // Multilingual responses with translations
  private translatedWelcomeMessages: TranslatedResponse = {
    en: [
      "Hey there! 🌱 I'm your farm assistant, and I'm so excited to help you today! I've been keeping an eye on your crops, and everything's looking pretty great. What would you like to check on first?",
      "Good morning! Hope you're having a wonderful day. I've been monitoring your farm overnight, and your plants are doing well. Anything specific you'd like to know about?",
      "Hello! Great to see you back. I love helping farmers like you take the best care of their crops. Your dedication really shows in how healthy everything looks!"
    ],
    es: [
      "¡Hola! 🌱 Soy tu asistente agrícola, ¡y estoy muy emocionado de ayudarte hoy! He estado cuidando tus cultivos, y todo se ve bastante bien. ¿Qué te gustaría revisar primero?",
      "¡Buenos días! Espero que tengas un día maravilloso. He estado monitoreando tu granja durante la noche, y tus plantas están bien. ¿Hay algo específico que te gustaría saber?",
      "¡Hola! Es genial verte de vuelta. Me encanta ayudar a agricultores como tú a cuidar mejor sus cultivos. ¡Tu dedicación realmente se nota en lo saludable que se ve todo!"
    ],
    fr: [
      "Salut ! 🌱 Je suis votre assistant agricole, et je suis très content de vous aider aujourd'hui ! J'ai surveillé vos cultures, et tout semble très bien. Que souhaitez-vous vérifier en premier ?",
      "Bonjour ! J'espère que vous passez une merveilleuse journée. J'ai surveillé votre ferme pendant la nuit, et vos plantes vont bien. Y a-t-il quelque chose de spécifique que vous aimeriez savoir ?",
      "Bonjour ! Ravi de vous revoir. J'adore aider les agriculteurs comme vous à prendre le meilleur soin de leurs cultures. Votre dévouement se voit vraiment dans la santé de tout !"
    ],
    pt: [
      "Olá! 🌱 Sou seu assistente agrícola, e estou muito animado para ajudá-lo hoje! Tenho estado de olho em suas plantações, e tudo está parecendo muito bom. O que gostaria de verificar primeiro?",
      "Bom dia! Espero que tenha um dia maravilhoso. Estive monitorando sua fazenda durante a noite, e suas plantas estão bem. Há algo específico que gostaria de saber?",
      "Olá! Ótimo te ver de volta. Adoro ajudar agricultores como você a cuidar melhor de suas plantações. Sua dedicação realmente aparece na saúde de tudo!"
    ],
    hi: [
      "नमस्ते! 🌱 मैं आपका कृषि सहायक हूं, और आज आपकी मदद करने के लिए बहुत उत्साहित हूं! मैं आपकी फसलों पर नज़र रख रहा हूं, और सब कुछ बहुत अच्छा लग रहा है। आप पहले क्या जांचना चाहेंगे?",
      "सुप्रभात! आशा है कि आपका दिन शानदार हो रहा है। मैं रात भर आपके खेत की निगरानी कर रहा था, और आपके पौधे अच्छे हैं। कुछ खास जानना चाहते हैं?",
      "नमस्ते! आपको वापस देखकर खुशी हुई। मुझे आपके जैसे किसानों की अपनी फसलों की सबसे अच्छी देखभाल करने में मदद करना अच्छा लगता है। आपकी मेहनत सच में सब कुछ की सेहत में दिखती है!"
    ]
  };

  private translatedGrowthTips: TranslatedResponse = {
    en: [
      "Here's what I've noticed: your crops are responding really well to the current care routine! One tip - morning watering tends to work better than evening for your soil type.",
      "Your plants are growing beautifully! If you want to boost growth, consider adding some organic compost to Zone 2. The soil there could use a nutrient boost.",
      "Great job on maintaining your crops! For even better growth, try adjusting your watering schedule to early morning. Plants absorb water more efficiently then."
    ],
    es: [
      "Esto es lo que he notado: ¡tus cultivos están respondiendo muy bien a la rutina de cuidado actual! Un consejo: el riego matutino tiende a funcionar mejor que el vespertino para tu tipo de suelo.",
      "¡Tus plantas están creciendo hermosamente! Si quieres impulsar el crecimiento, considera agregar compost orgánico a la Zona 2. El suelo allí podría necesitar un impulso de nutrientes.",
      "¡Excelente trabajo manteniendo tus cultivos! Para un crecimiento aún mejor, intenta ajustar tu horario de riego a primera hora de la mañana. Las plantas absorben agua más eficientemente entonces."
    ],
    fr: [
      "Voici ce que j'ai remarqué : vos cultures répondent très bien à la routine de soins actuelle ! Un conseil - l'arrosage matinal tend à mieux fonctionner que le soir pour votre type de sol.",
      "Vos plantes poussent magnifiquement ! Si vous voulez stimuler la croissance, pensez à ajouter du compost organique à la Zone 2. Le sol là-bas pourrait avoir besoin d'un boost nutritionnel.",
      "Excellent travail pour maintenir vos cultures ! Pour une croissance encore meilleure, essayez d'ajuster votre programme d'arrosage tôt le matin. Les plantes absorbent l'eau plus efficacement à ce moment-là."
    ],
    pt: [
      "Aqui está o que notei: suas plantações estão respondendo muito bem à rotina de cuidados atual! Uma dica - a irrigação matinal tende a funcionar melhor que a noturna para seu tipo de solo.",
      "Suas plantas estão crescendo lindamente! Se quer impulsionar o crescimento, considere adicionar composto orgânico à Zona 2. O solo lá poderia usar um impulso de nutrientes.",
      "Excelente trabalho mantendo suas plantações! Para um crescimento ainda melhor, tente ajustar seu cronograma de irrigação para o início da manhã. As plantas absorvem água mais eficientemente então."
    ],
    hi: [
      "यहाँ है जो मैंने देखा है: आपकी फसलें वर्तमान देखभाल की दिनचर्या के लिए बहुत अच्छी तरह से प्रतिक्रिया दे रही हैं! एक सुझाव - सुबह की सिंचाई आपकी मिट्टी के प्रकार के लिए शाम की तुलना में बेहतर काम करती है।",
      "आपके पौधे सुंदर तरीके से बढ़ रहे हैं! यदि आप वृद्धि को बढ़ावा देना चाहते हैं, तो जोन 2 में जैविक खाद डालने पर विचार करें। वहाँ की मिट्टी को पोषक तत्वों की जरूरत हो सकती है।",
      "अपनी फसलों को बनाए रखने का शानदार काम! और भी बेहतर वृद्धि के लिए, अपनी सिंचाई का समय सुबह जल्दी करने की कोशिश करें। पौधे तब पानी को अधिक कुशलता से अवशोषित करते हैं।"
    ]
  };

  private responses: DialogueResponse[] = [
    {
      keywords: ["hello", "hi", "hey", "start"],
      responses: [
        "Hey there! Great to see you checking in on your farm. How are your crops doing today?",
        "Hello! I'm here to help you take care of your farm. What would you like to check on first?",
        "Hi! I've been monitoring your farm data. Everything's looking pretty good overall. What's on your mind?",
      ],
    },
    {
      keywords: ["weather", "temperature", "rain", "forecast"],
      responses: [
        "The weather's looking good for your crops! Temperature is steady at 24°C, which is perfect for this time of year. No rain expected today, so your watering schedule is right on track.",
        "Today's forecast shows ideal growing conditions! Clear skies and comfortable temperatures. Your plants are going to love this weather.",
        "I'm keeping an eye on the weather for you. Looks like we might get some light rain tomorrow - that'll be great for your crops!",
      ],
    },
    {
      keywords: ["moisture", "water", "irrigation", "soil"],
      responses: [
        "Your soil moisture is at 15% right now - that's getting a bit low. I'd recommend watering soon, especially for your younger plants.",
        "Soil moisture levels are looking good in most areas! The irrigation system has been working well. Zone 3 might need a little extra attention though.",
        "Great question about soil moisture! I've been tracking it all week, and your irrigation timing has been spot on. Keep up the good work!",
      ],
    },
    {
      keywords: ["growth", "tips", "advice", "help"],
      responses: [
        "Here's what I've noticed: your crops are responding really well to the current care routine! One tip - morning watering tends to work better than evening for your soil type.",
        "Your plants are growing beautifully! If you want to boost growth, consider adding some organic compost to Zone 2. The soil there could use a nutrient boost.",
        "Great job on maintaining your crops! For even better growth, try adjusting your watering schedule to early morning. Plants absorb water more efficiently then.",
      ],
    },
    {
      keywords: ["expert", "help", "problem", "issue"],
      responses: [
        "I understand you need some expert help! Let me connect you with Maria, our crop specialist. She's really knowledgeable about issues like this.",
        "No worries - sometimes we all need a second opinion! I'm reaching out to our expert team. Dr. Johnson usually responds within an hour.",
        "I'd be happy to get you expert help! Let me send your question to our agricultural specialist. They'll have specific advice for your situation.",
      ],
    },
    {
      keywords: ["thanks", "thank you", "great", "good"],
      responses: [
        "You're so welcome! I'm here whenever you need help with your farm. Your dedication to your crops really shows!",
        "Happy to help! That's what I'm here for. Your farm is in great hands with all the care you're giving it.",
        "Anytime! I love being part of your farming journey. Keep up the excellent work!",
      ],
    },
  ];

  private sensorAlerts = [
    {
      type: "Low soil moisture detected",
      message: "Hey! I noticed your soil moisture dropped to 12% in Zone 2. Your tomatoes might be getting thirsty. Want me to remind you to water them?",
      sensorData: {
        type: "Soil Moisture - Zone 2",
        value: "12%",
        status: "warning" as const,
      },
    },
    {
      type: "Temperature alert",
      message: "Heads up - it's getting warm out there! Temperature just hit 32°C. Your leafy greens might appreciate some shade during the afternoon heat.",
      sensorData: {
        type: "Temperature",
        value: "32°C",
        status: "warning" as const,
      },
    },
    {
      type: "pH level notice",
      message: "Good news! Your soil pH is sitting perfectly at 6.8. Your plants are loving these conditions right now.",
      sensorData: {
        type: "Soil pH",
        value: "6.8",
        status: "good" as const,
      },
    },
  ];

  setLanguage(languageCode: string): void {
    if (this.languages.find(lang => lang.code === languageCode)) {
      this.currentLanguage = languageCode;
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getAvailableLanguages(): LanguageData[] {
    return this.languages;
  }

  getWelcomeMessage(): string {
    const messages = this.translatedWelcomeMessages[this.currentLanguage as keyof TranslatedResponse] || this.translatedWelcomeMessages.en;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  setLocation(locationName: string): void {
    const location = this.locations.find(loc => loc.name === locationName);
    if (location) {
      this.currentLocation = location;
    }
  }

  getCurrentLocation(): LocationData {
    return this.currentLocation;
  }

  getAvailableLocations(): LocationData[] {
    return this.locations;
  }

  generateResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    // Check for location-specific responses first
    const locationTips = this.locationSpecificTips[this.currentLocation.name];
    if (locationTips) {
      for (const category of locationTips) {
        if (category.keywords.some(keyword => lowerInput.includes(keyword))) {
          return category.responses[Math.floor(Math.random() * category.responses.length)];
        }
      }
    }
    
    // Fall back to general responses
    for (const category of this.responses) {
      if (category.keywords.some(keyword => lowerInput.includes(keyword))) {
        return category.responses[Math.floor(Math.random() * category.responses.length)];
      }
    }

    // Default responses for unmatched input
    const defaultResponses = [
      `That's a great question! I'm still learning about farming in ${this.currentLocation.name}. Let me think about that and get back to you with some helpful information.`,
      `I appreciate you asking! While I'm focused on monitoring your sensors and basic farm care here in ${this.currentLocation.name}, I'd love to connect you with one of our local experts who can give you detailed advice on that topic.`,
      `You know what? I want to make sure I give you the best possible answer for your ${this.currentLocation.climate} climate. Let me reach out to our farming specialists - they'll have much better insights on this than I do right now.`,
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  generateSensorAlert(): Omit<Message, "id" | "timestamp"> | null {
    if (Math.random() < 0.7) { // 70% chance to show alert
      const alert = this.sensorAlerts[Math.floor(Math.random() * this.sensorAlerts.length)];
      return {
        type: "ai",
        content: alert.message,
        sensorData: alert.sensorData,
      };
    }
    return null;
  }

  generateRandomAlert(): Omit<Message, "id" | "timestamp"> | null {
    if (Math.random() < 0.3) { // 30% chance for periodic alerts
      const proactiveMessages = [
        "Just wanted to check in! Your irrigation system ran perfectly this morning. Your crops got just the right amount of water.",
        "Your plants are looking fantastic today! The growth rate this week has been really impressive.",
        "Friendly reminder: it might be a good time to check on your pest traps. Prevention is always better than treatment!",
        "I've been tracking your farm's progress, and wow - you're doing such a great job! The consistency in your care really shows.",
      ];
      
      return {
        type: "ai",
        content: proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)],
      };
    }
    return null;
  }

  generateImageAnalysisResponse(): string {
    const analysisResponses = [
      "Thanks for sharing that image! I can see what you're concerned about. It looks like it might be early signs of nutrient deficiency - the yellowing on the lower leaves is a common indicator. Let me connect you with our plant pathologist who can give you a definitive diagnosis and treatment plan.",
      "I'm looking at your crop photo, and I can understand your concern. Those spots on the leaves could be a few different things - possibly fungal or pest-related. Our expert Maria has seen similar cases and would be the best person to help you identify this and recommend treatment.",
      "Great photo! I can see the issue you're worried about. While I can't give you a definitive diagnosis from the image alone, it looks like something our crop specialist Dr. Johnson deals with regularly. I'm sending this over to him right away - he usually responds within a couple hours with specific treatment recommendations.",
    ];

    return analysisResponses[Math.floor(Math.random() * analysisResponses.length)];
  }
}

export const dialogueSystem = new DialogueSystem();
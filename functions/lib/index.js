"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWordCloud = void 0;
const firebase_functions_1 = require("firebase-functions");
const responses_1 = require("./data/responses");
//const { logger } = require('firebase-functions')
const https_1 = require("firebase-functions/https");
const sw = __importStar(require("stopword"));
const app_1 = require("firebase-admin/app");
//const { getFirestore } = require('firebase-admin/firestore')
(0, app_1.initializeApp)();
//req should pass in a survey id, will do that logic later
exports.generateWordCloud = (0, https_1.onRequest)(async (req, res) => {
    const responses = [responses_1.r1, responses_1.r2, responses_1.r3, responses_1.r4, responses_1.r5];
    let textParts = [];
    // Loop through each response object
    responses.forEach((response) => {
        // Loop through the answers array inside that response
        response.answers.forEach((answer) => {
            if (answer.value && typeof answer.value === 'string') {
                textParts.push(answer.value);
            }
        });
    });
    // Join them all into one giant string separated by spaces
    const allText = textParts.join(' ');
    const wordCloud = getWordFrequency(allText);
    res.send(wordCloud);
});
function getWordFrequency(text) {
    //  Lowercase and remove punctuation/special characters
    const cleanText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
    // Split into an array of words
    const words = cleanText.split(/\s+/).filter((word) => word.length > 1);
    //  Remove common stopwords (the, a, is, etc.)
    // sw.eng is the English dictionary provided by the library
    const filteredWords = sw.removeStopwords(words, sw.eng);
    // Count occurrences
    const freqMap = {};
    filteredWords.forEach((word) => {
        freqMap[word] = (freqMap[word] || 0) + 1;
    });
    // Transform to WordCloudDatum[]
    return Object.entries(freqMap)
        .map(([text, value]) => ({ text, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 100); // Return top 100 words for performance
}
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
//# sourceMappingURL=index.js.map
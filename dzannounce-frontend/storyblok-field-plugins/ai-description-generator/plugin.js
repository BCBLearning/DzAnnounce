// storyblok-field-plugins/ai-description-generator/plugin.js
let storyblok = null; // Variable pour l'instance Storyblok

// Attendre que le SDK Storyblok soit prêt
window.onload = function() {
    storyblok = new StoryblokBridge();

    // Récupérer les éléments du DOM
    const keywordsInput = document.getElementById('keywords');
    const initialDescriptionTextarea = document.getElementById('initialDescription');
    const generateBtn = document.getElementById('generateBtn');
    const translateFrBtn = document.getElementById('translateFrBtn');
    const translateArBtn = document.getElementById('translateArBtn');
    const translateKabBtn = document.getElementById('translateKabBtn');
    const categorizeBtn = document.getElementById('categorizeBtn');
    const messageDisplay = document.getElementById('message');

    let currentFieldContent = ''; // Pour stocker le contenu actuel du champ Richtext

    // Initialiser le plugin avec le contenu du champ Storyblok
    storyblok.on(['input', 'change'], (event) => {
        // Le type de champ `richtext` stocke son contenu dans `event.story.content.field_name.content`
        // Assurez-vous que 'description' est le nom de votre champ Richtext dans Storyblok
        if (event.story.content.description && event.story.content.description.content) {
            // Convertir le contenu Richtext en texte brut pour l'IA
            currentFieldContent = convertRichtextToPlainText(event.story.content.description.content);
            initialDescriptionTextarea.value = currentFieldContent;
        }
    });

    // Fonction utilitaire pour convertir le contenu Richtext en texte brut
    function convertRichtextToPlainText(richtextContent) {
        if (!richtextContent || !richtextContent.content) return '';
        let plainText = '';
        richtextContent.content.forEach(node => {
            if (node.type === 'paragraph' || node.type === 'heading') {
                node.content.forEach(textNode => {
                    if (textNode.type === 'text') {
                        plainText += textNode.text;
                    }
                });
                plainText += '\n'; // Nouvelle ligne pour les paragraphes
            }
            // Vous pouvez ajouter d'autres types de nœuds si nécessaire
        });
        return plainText.trim();
    }

    // Fonction utilitaire pour convertir le texte brut en format Richtext pour Storyblok
    function convertPlainTextToRichtext(plainText) {
        const paragraphs = plainText.split('\n').filter(p => p.trim() !== '');
        const contentNodes = paragraphs.map(p => ({
            type: 'paragraph',
            content: [{ type: 'text', text: p }]
        }));
        return {
            type: 'doc',
            content: contentNodes
        };
    }

    // Fonction pour afficher des messages
    function showMessage(text, isError = false) {
        messageDisplay.textContent = text;
        messageDisplay.style.display = 'block';
        messageDisplay.className = isError ? 'message error' : 'message';
        setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, 5000); // Masquer après 5 secondes
    }

    // Fonction pour envoyer des requêtes à notre API Next.js
    async function callAiApi(action, payload) {
        try {
            // Utiliser l'URL de ton serveur Next.js qui tourne sur Termux
            // IMPORTANT: Assure-toi que ton Next.js est bien lancé via `npm run dev`
            const apiBaseUrl = 'http://localhost:3000';
            const response = await fetch(`${apiBaseUrl}/api/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erreur d'appel API:", error);
            showMessage(`Erreur: ${error.message}`, true);
            throw error; // Rejeter l'erreur pour que les gestionnaires d'événements puissent la capturer
        }
    }

    // Gestionnaire pour la génération de description
    generateBtn.addEventListener('click', async () => {
        generateBtn.disabled = true;
        showMessage('Génération en cours...', false);
        try {
            const keywords = keywordsInput.value;
            const initialDescription = initialDescriptionTextarea.value;
            const data = await callAiApi('generateDescription', { keywords, initialDescription });
            const newRichtextContent = convertPlainTextToRichtext(data.description);
            storyblok.set({ field: 'description', content: newRichtextContent });
            showMessage('Description générée et mise à jour !');
        } finally {
            generateBtn.disabled = false;
        }
    });

    // Gestionnaire pour la traduction
    [translateFrBtn, translateArBtn, translateKabBtn].forEach(button => {
        button.addEventListener('click', async (e) => {
            const targetLanguage = e.target.dataset.lang;
            e.target.disabled = true;
            showMessage(`Traduction en ${targetLanguage} en cours...`, false);
            try {
                const textToTranslate = initialDescriptionTextarea.value || currentFieldContent;
                if (!textToTranslate.trim()) {
                    showMessage("Aucun texte à traduire.", true);
                    return;
                }
                const data = await callAiApi('translate', { text: textToTranslate, targetLanguage });
                const translatedRichtextContent = convertPlainTextToRichtext(data.translatedText);
                storyblok.set({ field: 'description', content: translatedRichtextContent });
                showMessage(`Traduction en ${targetLanguage} effectuée !`);
            } finally {
                e.target.disabled = false;
            }
        });
    });

    // Gestionnaire pour la suggestion de catégorie
    categorizeBtn.addEventListener('click', async () => {
        categorizeBtn.disabled = true;
        showMessage('Suggestion de catégorie en cours...', false);
        try {
            // Obtenez le titre de l'annonce et sa description pour l'IA
            // 'storyblok.story.content' contient toutes les données de la story actuelle
            const storyContent = storyblok.story.content;
            const title = storyContent.titre || ''; // Assurez-vous que le champ 'titre' existe
            const description = currentFieldContent || ''; // Utilisez la description actuelle du champ

            const data = await callAiApi('suggestCategory', { text: `${title} ${description}` });

            // Mettre à jour le champ 'categorie' dans Storyblok
            // Note: Storyblok.set({ field: 'categorie', content: value })
            // fonctionne pour les champs simples comme Dropdown
            storyblok.set({ field: 'categorie', content: data.category });
            showMessage(`Catégorie suggérée : ${data.category} !`);

        } finally {
            categorizeBtn.disabled = false;
        }
    });
};


from flask import Flask, request, jsonify
import spacy
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
import threading
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Database connection with timeout settings
client = MongoClient(
    "mongodb://localhost:27017/",
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    serverSelectionTimeoutMS=5000
)
db = client["Socially"]

nlp = spacy.load("en_core_web_sm", disable=["lemmatizer", "ner"])

def extract_nouns(text):
    doc = nlp(text)
    
    nouns = set()
    
    # 1. Extract noun phrases (multi-word nouns)
    for chunk in doc.noun_chunks:
        if all(token.pos_ in ['NOUN', 'PROPN'] for token in chunk):
            clean_phrase = ' '.join(
                token.text.lower() 
                for token in chunk 
                if not token.is_stop and not token.is_punct
            )
            if len(clean_phrase) > 3:  # Minimum length requirement
                nouns.add(clean_phrase)
    
    # 2. Add individual nouns not captured in phrases
    nouns.update(
        token.text.lower() 
        for token in doc 
        if token.pos_ in ['NOUN', 'PROPN']
        and not token.is_stop
        and len(token.text) > 3
    )
    
    return sorted(nouns)  # Return sorted list for consistency

def analyze_post(text):
    keywords = extract_nouns(text)
    return {
        "keywords": keywords
    }

def analyze_and_update(post_id, text):
    try:
        result = analyze_post(text)
        update_result = db.posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$set': {
                'keywords': result['keywords'],
            }},
            upsert=False
        )
        
        print(f"Matched {update_result.matched_count} documents")
        print(f"Modified {update_result.modified_count} documents")
        
        if update_result.matched_count == 0:
            logger.warning(f"No posts found for creator {post_id}")
        else:
            logger.info(f"Updated post(s) for creator {post_id}")
            
    except Exception as e:
        logger.error(f"Error processing post {post_id}: {str(e)}")
        raise
    
@app.route('/analyze', methods=['POST'])
def analyze():
    """API endpoint to trigger text analysis"""
    data = request.get_json()
    
    # Input validation
    if not data or 'postId' not in data or 'text' not in data:
        return jsonify({"error": "Missing postId or text"}), 400
    # Start background processing
    thread = threading.Thread(
        target=analyze_and_update,
        args=(data['postId'], data['text'])
    )
    thread.daemon = True  # Allow thread to exit with main process
    thread.start()
    
    return jsonify({
        "status": "processing_started",
        "postId": data['postId']
    })

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5001,
        threaded=True,
        debug=False
    )
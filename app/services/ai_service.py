def classify_waste_and_priority(description: str):
    desc_lower = description.lower()
    
    # Category prediction
    category = "General Waste"
    if any(w in desc_lower for w in ["plastic", "bottle", "can", "paper", "cardboard"]):
        category = "Recyclable Waste"
    elif any(w in desc_lower for w in ["food", "vegetable", "organic", "fruit", "wet"]):
        category = "Organic Waste"
    elif any(w in desc_lower for w in ["chemical", "battery", "e-waste", "medical", "glass"]):
        category = "Hazardous Waste"
        
    # Priority level
    priority = "MEDIUM"
    if any(w in desc_lower for w in ["overflowing", "urgent", "hazard", "blocked", "smell", "stink"]):
        priority = "HIGH"
    elif any(w in desc_lower for w in ["small", "few", "minor"]):
        priority = "LOW"
        
    return {
        "predicted_category": category,
        "priority_level": priority
    }
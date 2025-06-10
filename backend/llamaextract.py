from llama_cloud_services import LlamaExtract

from schema import Document

def setup_llamaextract():
    """Setup LlamaExtract agent"""
    extractor = LlamaExtract()
    
    # Try to get existing agent or create new one
    try:
        agent = extractor.get_agent(name="document-parser-app")
    except:
        agent = extractor.create_agent(name="document-parser-app", data_schema=Document)
    
    return agent
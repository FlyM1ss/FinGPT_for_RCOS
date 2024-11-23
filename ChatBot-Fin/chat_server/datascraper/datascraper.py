from dotenv import load_dotenv
import time
import requests
from bs4 import BeautifulSoup
import os
import openai
import base64
from googlesearch import search
from urllib.parse import urljoin
from django.conf import settings
from . import cdm_rag

# api_key = settings.OPENAI_API_KEY
openai.api_type = "azure"
openai.api_base = "https://apiforfingpt.openai.azure.com/"
openai.api_version = "2024-08-06"

openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")

model_deployment = "gpt-4o"

def data_scrape(url, timeout=2):
    try:
        start_time = time.time()
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        response = requests.get(url, headers=headers, timeout=timeout)
        end_time = time.time()
        elapsed_time = end_time - start_time

        if response.status_code == 200:
            if elapsed_time > timeout:
                print("Request took more than", timeout, "seconds. Skipping:", url)
                return -1

            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove unwanted tags
            for script_or_style in soup(['script', 'style', 'header', 'footer', 'nav', 'aside']):
                script_or_style.decompose()

            # For Yahoo Finance and Bloomberg specific elements
            for unwanted in soup.select('.advertisement, .ad-container, .footer, .nav, .header'):
                unwanted.decompose()

            # Extract text
            text = ' '.join(soup.stripped_strings)
            first_5000_characters = text[:5000]

            print("Successfully scraped:", url)
            return first_5000_characters
        else:
            print('Failed to retrieve the page:', url)
            return -1
    except requests.exceptions.Timeout:
        print('Request timed out after', timeout, 'seconds. Skipping:', url)
        return -1
    except Exception as e:
        print('An error occurred:', str(e))
        return -1


def get_preferred_urls():
    """
    Reads user-preferred URLs from a file and returns them as a list.
    """
    file_path = 'preferred_urls.txt'
    preferred_urls = []

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            preferred_urls = [line.strip() for line in file.readlines()]

    return preferred_urls


def search_preferred_urls(keyword):
    """
    Searches within the preferred URLs using the provided keyword.
    """
    preferred_urls = get_preferred_urls()
    message_list = []

    for url in preferred_urls:
        info = data_scrape(url)
        print(f"Found in preferred URL: {url}")
        message_list.append({"role": "system", "content": info})
        # if info != -1 and keyword.lower() in info.lower():
        #     print(f"Found in preferred URL: {url}")
        #     message_list.append({"role": "system", "content": info})
        # else:
        #     print(f"Nothing found in preferred URL: {url}")

    return message_list


def search_websites_with_keyword(keyword):
    """
    Searches the web using Google and prioritizes user-preferred URLs.
    """
    # First, search within preferred URLs
    message_list = search_preferred_urls(keyword)

    # If no relevant information found in preferred URLs, fall back to Google search
    if not message_list:
        search_query = f"intitle:{keyword}"
        search_url = f"https://www.google.com/search?q={search_query}"
        headers = {"User-Agent": "Your User Agent Here"}
        response = requests.get(search_url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            search_results = soup.find_all("a")
            for result in search_results:
                link = result.get("href")
                if link and link.startswith("/url?q="):
                    url = link[7:]
                    info = data_scrape(url)
                    if info != -1:
                        message_list.append({"role": "system", "content": info})
        else:
            print("Failed to retrieve search results.")

    return message_list

def create_rag_response(user_input, message_list):
    """
    Generates a response using the RAG pipeline with Azure OpenAI Service.
    """
    try:
        response = cdm_rag.get_rag_response(user_input, model_deployment)
        message_list.append({"role": "assistant", "content": response})
        return response
    except FileNotFoundError as e:
        error_message = str(e)
        message_list.append({"role": "assistant", "content": error_message})
        return error_message

def create_rag_advanced_response(user_input, message_list):
    """
    Generates an advanced response using the RAG pipeline with Azure OpenAI Service.
    """
    try:
        response = cdm_rag.get_rag_advanced_response(user_input, model_deployment)
        message_list.append({"role": "assistant", "content": response})
        return response
    except FileNotFoundError as e:
        error_message = str(e)
        message_list.append({"role": "assistant", "content": error_message})
        return error_message


def create_response(user_input, message_list):
    """
    Creates a response using Azure OpenAI Service and a specified deployment name.
    """
    print(message_list)
    print("Starting creation")

    message_list.append({"role": "user", "content": user_input})

    completion = openai.ChatCompletion.create(
        engine=model_deployment,  # Use 'engine' instead of 'model'
        messages=message_list,
    )

    assistant_response = completion.choices[0].message.content
    print(assistant_response)

    message_list.append({"role": "assistant", "content": assistant_response})

    return assistant_response


def create_advanced_response(user_input, message_list):
    """
    Creates an advanced response by searching through user-preferred URLs first,
    then falling back to a general web search using the specified deployment name.
    """
    print(message_list)
    print("Starting creation")

    # Search in preferred URLs first
    print("Searching user-preferred URLs")
    preferred_message_list = search_preferred_urls(user_input)
    message_list.extend(preferred_message_list)

    # If no relevant information found, fall back to general web search
    if not preferred_message_list:
        for url in search(user_input, num=10, stop=10, pause=0):
            info = data_scrape(url)
            if info != -1:
                message_list.append({"role": "system", "content": f"url: {url} info: {info}"})

    message_list.append({"role": "user", "content": user_input})
    completion = openai.ChatCompletion.create(
        engine=model_deployment,  # Use 'engine' instead of 'model'
        messages=message_list,
    )
    assistant_response = completion.choices[0].message.content
    print(assistant_response)

    return assistant_response

def process_uploaded_file(file_path, text_prompt):
    try:
        # API key is already set globally; no need to set it again

        # Construct the raw GitHub URL
        username = 'FlyM1ss'
        repository = 'FinGPT_for_RCOS'
        branch = 'fingpt_for_sec'
        path_to_file = os.path.relpath(file_path).replace('\\', '/')

        image_url = f'https://raw.githubusercontent.com/{username}/{repository}/{branch}/{path_to_file}'

        # Prepare the messages
        messages = [
            {
                "role": "user",
                "content": f"{text_prompt}\n\nPlease analyze the following image:\n{image_url}",
            },
        ]

        # Create the chat completion
        completion = openai.ChatCompletion.create(
            engine="<your-image-model-deployment-name>",
            messages=messages,
        )

        # Extract and return the response
        answer = completion.choices[0].message.content
        print(f"Assistant Response: {answer}")
        return answer

    except Exception as e:
        print(f"Error processing image: {e}")
        return f"An error occurred while processing the image: {e}"


def get_sources(query):
    """
    Retrieves source URLs by first searching through preferred URLs, then falling back to Google search.
    """
    sources = []

    # First, search within preferred URLs
    preferred_urls = get_preferred_urls()
    for url in preferred_urls:
        info = data_scrape(url)
        if info != -1 and query.lower() in info.lower():
            tup = url, get_website_icon(url)
            sources.append(tup)
            print(f"Preferred source: {url}")

    # If no sources found in preferred URLs, fall back to Google search
    if not sources:
        for url in search(query, num=6, stop=6, pause=0):
            info = data_scrape(url)
            if info != -1:
                tup = url, get_website_icon(url)
                sources.append(tup)
                print(url)

    return sources


def get_website_icon(url):
    """
    Retrieves the website icon (favicon) for a given URL.
    """
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    favicon_tag = soup.find('link', rel='icon') or soup.find('link', rel='shortcut icon')
    if favicon_tag:
        favicon_url = favicon_tag.get('href')
        favicon_url = urljoin(url, favicon_url)
        return favicon_url
    return None


def handle_multiple_models(question, message_list, models):
    """
    Handles responses from multiple model deployments and returns a dictionary with deployment names as keys.
    """
    responses = {}
    for model_deployments in models:
        if "advanced" in model_deployments:
            responses[model_deployments] = create_advanced_response(
                question, message_list.copy()
            )
        else:
            responses[model_deployments] = create_response(
                question, message_list.copy()
            )
    return responses

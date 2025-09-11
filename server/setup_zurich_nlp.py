"""
Setup script for ZurichNLP spoken-to-signed translation model.

This script helps set up the ZurichNLP model and its dependencies for the Gestura server.
It handles downloading the model, setting up the lexicon, and configuring the environment.

"""

import os
import subprocess
import sys
from pathlib import Path


def run_command(cmd, description):
    """Run a command and handle errors."""
    print(f"\n{description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed")
        print(f"Error: {e.stderr}")
        return False


def setup_zurich_nlp():
    """Set up the ZurichNLP model and dependencies."""
    print("Setting up ZurichNLP spoken-to-signed translation model...")
    
    # Change to server directory
    server_dir = Path(__file__).parent
    os.chdir(server_dir)
    
    # Step 1: Clone the repository if it doesn't exist
    if not os.path.exists("spoken-to-signed-translation"):
        success = run_command(
            "git clone https://github.com/ZurichNLP/spoken-to-signed-translation",
            "Cloning ZurichNLP repository"
        )
        if not success:
            return False
    else:
        print("✓ ZurichNLP repository already exists")
    
    # Step 2: Install the package
    success = run_command(
        "cd spoken-to-signed-translation && pip install .",
        "Installing ZurichNLP package"
    )
    if not success:
        return False
    
    # Step 3: Install pose-to-video
    success = run_command(
        "pip install git+https://github.com/sign-language-processing/pose-to-video",
        "Installing pose-to-video package"
    )
    if not success:
        return False
    
    # Step 4: Install additional dependencies
    success = run_command(
        "pip install pose-format tensorflow",
        "Installing additional dependencies"
    )
    if not success:
        return False
    
    # Step 5: Test the installation
    print("\nTesting ZurichNLP installation...")
    test_cmd = [
        "python", "-c",
        "from spoken_to_signed import text_to_gloss_to_pose; print('ZurichNLP import successful')"
    ]
    
    try:
        result = subprocess.run(test_cmd, capture_output=True, text=True, check=True)
        print("✓ ZurichNLP installation test passed")
        print(f"Test output: {result.stdout}")
    except subprocess.CalledProcessError as e:
        print("✗ ZurichNLP installation test failed")
        print(f"Error: {e.stderr}")
        return False
    
    print("\n✓ ZurichNLP setup completed successfully!")
    print("\nNext steps:")
    print("1. The model will use the dummy lexicon by default")
    print("2. To use a full lexicon, download it with: download_lexicon --name signsuisse --directory lexicon")
    print("3. Update the lexicon path in zurich_nlp_services.py if needed")
    
    return True


def download_lexicon():
    """Download the full SignSuisse lexicon."""
    print("Downloading SignSuisse lexicon (this may take a while)...")
    
    success = run_command(
        "download_lexicon --name signsuisse --directory lexicon",
        "Downloading SignSuisse lexicon"
    )
    
    if success:
        print("✓ Lexicon downloaded successfully")
        print("Update the lexicon_path in zurich_nlp_services.py to use the full lexicon")
    else:
        print("✗ Lexicon download failed")
        print("The model will use the dummy lexicon instead")
    
    return success


if __name__ == "__main__":
    print("ZurichNLP Setup Script for Gestura Server")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "lexicon":
        download_lexicon()
    else:
        setup_zurich_nlp()

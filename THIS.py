import os
import shutil
import sys
import time

def get_file_list(folder_path):
    """
    Traverse a directory and return a list of files with their relative paths.
    """
    file_list = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            # Get absolute path
            abs_path = os.path.join(root, file)
            # Get relative path (to preserve structure)
            rel_path = os.path.relpath(abs_path, folder_path)
            file_list.append((rel_path, abs_path))
    return file_list

def compare_folders(source, dest):
    """
    Compare files in Source (A) vs Destination (B).
    Returns a list of tuples: (source_full_path, dest_full_path, reason)
    """
    tasks = []
    
    # Walk through source directory
    for root, dirs, files in os.walk(source):
        # Calculate relative path from source root
        rel_path = os.path.relpath(root, source)
        
        # Determine corresponding path in destination
        dest_dir = os.path.join(dest, rel_path)
        
        for filename in files:
            src_file = os.path.join(root, filename)
            dst_file = os.path.join(dest_dir, filename)
            
            # Condition 1: File does not exist in Destination
            if not os.path.exists(dst_file):
                tasks.append((src_file, dst_file, "NEW FILE"))
            
            # Condition 2: File exists but Source is newer (Update)
            else:
                src_mtime = os.path.getmtime(src_file)
                dst_mtime = os.path.getmtime(dst_file)
                
                # Check if source is newer by at least 1 second (to avoid precision issues)
                if src_mtime > dst_mtime + 1:
                    tasks.append((src_file, dst_file, "UPDATE (Source is newer)"))

    return tasks

def main():
    print("------------------------------------------------")
    print("   FILE DIFFERENCE MANAGER (One-way Sync)")
    print("------------------------------------------------")
    
    # 1. Get Path A (Source)
    while True:
        path_a = input("Enter Source Folder Path (A): ").strip()
        if os.path.isdir(path_a):
            break
        print("[!] Error: Path A does not exist or is not a directory. Please try again.")

    # 2. Get Path B (Destination)
    while True:
        path_b = input("Enter Destination Folder Path (B): ").strip()
        # Create B if it doesn't exist?
        if not os.path.exists(path_b):
            create = input(f"Path B does not exist. Create it? (y/n): ").lower()
            if create == 'y':
                try:
                    os.makedirs(path_b)
                    break
                except OSError as e:
                    print(f"[!] Error creating directory: {e}")
            else:
                continue
        elif os.path.isdir(path_b):
            break
        else:
            print("[!] Error: Path B is a file, not a directory.")

    print("\nScanning directories... Please wait.")
    
    # 3. Analyze differences
    sync_tasks = compare_folders(path_a, path_b)

    if not sync_tasks:
        print("\n[OK] No differences found. Folder B is up to date with Folder A.")
        sys.exit(0)

    # 4. Display findings
    print(f"\nFound {len(sync_tasks)} file(s) in A that need to be copied to B:")
    print("-" * 60)
    for src, dst, reason in sync_tasks:
        print(f"[{reason}] {os.path.basename(src)}")
        print(f"    From: {src}")
        print(f"    To:   {dst}")
    print("-" * 60)

    # 5. Confirm Execution
    confirm = input(f"\nProceed with copying {len(sync_tasks)} files? (y/n): ").lower()
    
    if confirm != 'y':
        print("Operation cancelled by user.")
        sys.exit(0)

    # 6. Execute Copy
    print("\nStarting copy process...")
    success_count = 0
    error_count = 0

    for src, dst, reason in sync_tasks:
        try:
            # Ensure destination directory exists
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            
            # Copy file and preserve metadata (timestamps)
            shutil.copy2(src, dst)
            print(f"[DONE] {os.path.basename(src)}")
            success_count += 1
        except Exception as e:
            print(f"[FAIL] Could not copy {os.path.basename(src)}")
            print(f"       Reason: {e}")
            error_count += 1

    # 7. Final Report
    print("\n------------------------------------------------")
    print("SUMMARY")
    print(f"Total Processed: {len(sync_tasks)}")
    print(f"Successful:      {success_count}")
    print(f"Failed:          {error_count}")
    print("------------------------------------------------")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nScript interrupted by user. Exiting.")
        sys.exit(0)


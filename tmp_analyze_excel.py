import pandas as pd

try:
    file_path = '/Users/tykers/Downloads/mizan/Outreach and Financial Information MFIs  June 30 2025 (1).xls'
    
    print("\n{'='*50}\nSheet Name: Products and Services\n{'='*50}")
    df = pd.read_excel(file_path, sheet_name='Products and Services')
    df_clean = df.dropna(how='all').dropna(axis=1, how='all')
    
    # Print the column headers explicitly
    print("Columns:")
    print(df_clean.iloc[2].tolist())
    
    print("\nData:")
    # Print a few rows as dictionaries for full visibility
    for i in range(3, min(10, len(df_clean))):
        print(df_clean.iloc[i].to_dict())
        
except Exception as e:
    print(f"Error reading Excel file: {e}")

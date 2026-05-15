import pandas as pd
import os
import glob


caminho = 'C:/Users/52576815871/Documents/resumos'

arquivos = glob.glob(os.path.join(caminho, '*.csv'))

lista_df = [pd.read_csv(arquivo) for arquivo in arquivos]

df_final = pd.concat(lista_df, ignore_index=True)
print(df_final)

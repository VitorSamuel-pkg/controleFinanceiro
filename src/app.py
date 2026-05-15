import pandas as pd
import os
import glob


caminho = 'C:/Users/52576815871/Documents/resumos'

arquivos = glob.glob(os.path.join(caminho, '*.csv'))

lista_dfs = []

for arquivo in arquivos:
    df = pd.read_csv(arquivo)
    lista_dfs.append(df)
df_concatenado = pd.concat(lista_dfs, ignore_index=True)
print(df_concatenado.head())

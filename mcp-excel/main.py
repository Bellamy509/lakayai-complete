#!/usr/bin/env python3
"""
Excel AI-Sheets MCP Server
Serveur MCP pour manipuler des fichiers Excel avec pandas et openpyxl
"""

import asyncio
import json
import sys
from typing import Any, Dict, List, Optional
from pathlib import Path
import pandas as pd
import numpy as np

# MCP SDK imports
from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.server.stdio import stdio_server
from mcp.types import Resource, Tool, TextContent, ImageContent, EmbeddedResource

# Initialisation du serveur MCP
server = Server("AI-Sheets")

# Stockage des classeurs en mémoire (similaire au serveur PowerPoint)
workbooks: Dict[str, Dict[str, pd.DataFrame]] = {}
workbook_paths: Dict[str, str] = {}

def auto_save_workbook(filename: str) -> str:
    """Sauvegarde automatique d'un classeur"""
    if filename not in workbooks:
        return "❌ Classeur non trouvé"
    
    try:
        file_path = workbook_paths.get(filename)
        if not file_path:
            # Chemin par défaut
            file_path = f"/Users/usuario1/Documents/{filename}.xlsx"
            workbook_paths[filename] = file_path
        
        # Créer le répertoire si nécessaire
        Path(file_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Sauvegarder toutes les feuilles du classeur
        with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
            for sheet_name, df in workbooks[filename].items():
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        return f"�� Sauvegarde automatique: {file_path}"
    except Exception as e:
        return f"❌ Erreur sauvegarde automatique: {str(e)}"

@server.list_tools()
async def handle_list_tools() -> List[Tool]:
    """Liste tous les outils disponibles pour Excel"""
    return [
        Tool(
            name="create_workbook",
            description="Créer un nouveau classeur Excel vide en mémoire",
            inputSchema={
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Nom du classeur (sans extension .xlsx)"
                    },
                    "output_path": {
                        "type": "string",
                        "description": "Chemin de sauvegarde (optionnel, par défaut Documents)"
                    }
                },
                "required": ["filename"]
            }
        ),
        Tool(
            name="add_sheet",
            description="Ajouter une feuille avec des données au classeur",
            inputSchema={
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Nom du classeur"
                    },
                    "sheet_name": {
                        "type": "string",
                        "description": "Nom de la feuille"
                    },
                    "data": {
                        "type": "array",
                        "description": "Tableau d'objets JSON représentant les données",
                        "items": {
                            "type": "object",
                            "description": "Un objet JSON avec propriétés = colonnes"
                        }
                    }
                },
                "required": ["filename", "sheet_name", "data"]
            }
        ),
        Tool(
            name="save_workbook",
            description="Sauvegarder manuellement le classeur Excel",
            inputSchema={
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Nom du classeur"
                    },
                    "output_path": {
                        "type": "string",
                        "description": "Chemin de sortie (optionnel)"
                    }
                },
                "required": ["filename"]
            }
        ),
        Tool(
            name="write_excel",
            description="Créer un fichier Excel avec des données",
            inputSchema={
                "type": "object",
                "properties": {
                    "file_path": {
                        "type": "string",
                        "description": "Chemin complet vers le fichier Excel à créer"
                    },
                    "data": {
                        "type": "array",
                        "description": "Tableau d'objets JSON représentant les données",
                        "items": {
                            "type": "object",
                            "description": "Un objet JSON avec propriétés = colonnes"
                        }
                    },
                    "sheet_name": {
                        "type": "string",
                        "description": "Nom de la feuille Excel (optionnel)"
                    }
                },
                "required": ["file_path", "data"]
            }
        ),
        Tool(
            name="read_excel",
            description="Lire un fichier Excel et retourner son contenu",
            inputSchema={
                "type": "object",
                "properties": {
                    "file_path": {
                        "type": "string",
                        "description": "Chemin vers le fichier Excel (.xlsx, .xls, .csv)"
                    },
                    "sheet_name": {
                        "type": "string",
                        "description": "Nom de la feuille (optionnel, première feuille par défaut)"
                    },
                    "max_rows": {
                        "type": "integer",
                        "description": "Nombre maximum de lignes à lire (défaut: 100)"
                    }
                },
                "required": ["file_path"]
            }
        ),
        Tool(
            name="test_simple",
            description="Test simple pour vérifier la connexion MCP",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Message de test"
                    }
                },
                "required": ["message"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Gestionnaire d'appels d'outils"""
    
    # Debug : afficher tous les appels d'outils
    print(f"DEBUG AI-Sheets: Outil appelé = {name}, Arguments = {arguments}")
    
    if name == "create_workbook":
        filename = arguments["filename"]
        output_path = arguments.get("output_path")
        
        # Créer un nouveau classeur en mémoire
        workbooks[filename] = {}
        
        # Définir le chemin de sauvegarde
        if output_path:
            file_path = f"{output_path}/{filename}.xlsx"
        else:
            file_path = f"/Users/usuario1/Documents/{filename}.xlsx"
        
        workbook_paths[filename] = file_path
        
        return [TextContent(
            type="text",
            text=f"✅ Classeur '{filename}' créé avec succès\n💾 Sera sauvegardé dans: {file_path}"
        )]
    
    elif name == "add_sheet":
        filename = arguments["filename"]
        sheet_name = arguments["sheet_name"]
        data = arguments["data"]
        
        if filename not in workbooks:
            return [TextContent(
                type="text",
                text=f"❌ Erreur: Classeur '{filename}' non trouvé. Créez d'abord un classeur."
            )]
        
        try:
            # Convertir les données en DataFrame
            df = pd.DataFrame(data)
            workbooks[filename][sheet_name] = df
            
            # Sauvegarde automatique
            auto_save_msg = auto_save_workbook(filename)
            
            result = {
                "filename": filename,
                "sheet_name": sheet_name,
                "rows_added": len(df),
                "columns_added": len(df.columns),
                "column_names": list(df.columns)
            }
            
            return [TextContent(
                type="text",
                text=f"✅ Feuille '{sheet_name}' ajoutée au classeur '{filename}'\n"
                     f"📊 {len(df)} lignes, {len(df.columns)} colonnes\n"
                     f"{auto_save_msg}\n\n"
                     f"{json.dumps(result, indent=2, ensure_ascii=False)}"
            )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Erreur lors de l'ajout de la feuille : {str(e)}"
            )]
    
    elif name == "save_workbook":
        filename = arguments["filename"]
        output_path = arguments.get("output_path")
        
        if filename not in workbooks:
            return [TextContent(
                type="text",
                text=f"❌ Erreur: Classeur '{filename}' non trouvé."
            )]
        
        try:
            # Utiliser le chemin fourni ou celui par défaut
            if output_path:
                file_path = f"{output_path}/{filename}.xlsx"
                workbook_paths[filename] = file_path
            else:
                file_path = workbook_paths.get(filename, f"/Users/usuario1/Documents/{filename}.xlsx")
            
            # Créer le répertoire si nécessaire
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            # Sauvegarder toutes les feuilles du classeur
            with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                for sheet_name, df in workbooks[filename].items():
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            sheet_count = len(workbooks[filename])
            total_rows = sum(len(df) for df in workbooks[filename].values())
            
            return [TextContent(
                type="text",
                text=f"✅ Classeur sauvegardé: {file_path}\n"
                     f"📊 {sheet_count} feuilles, {total_rows} lignes au total"
            )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Erreur lors de la sauvegarde: {str(e)}"
            )]
    
    elif name == "write_excel":
        # Vérifier les paramètres requis
        if "file_path" not in arguments:
            return [TextContent(
                type="text",
                text="❌ Erreur : Le paramètre 'file_path' est requis"
            )]
        
        if "data" not in arguments:
            return [TextContent(
                type="text",
                text="❌ Erreur : Le paramètre 'data' est requis"
            )]
        
        file_path = arguments["file_path"]
        data = arguments["data"]
        sheet_name = arguments.get("sheet_name", "Sheet1")
        
        # Debug : afficher les paramètres reçus
        print(f"DEBUG write_excel: file_path={file_path}, data type={type(data)}, data={data}")
        
        try:
            # Vérifier que data est une liste
            if not isinstance(data, list):
                return [TextContent(
                    type="text",
                    text=f"❌ Erreur : 'data' doit être une liste d'objets, reçu: {type(data)}"
                )]
            
            # Convertir les données en DataFrame
            df = pd.DataFrame(data)
            
            # Utiliser le dossier Documents si pas de chemin complet
            if not file_path.startswith('/'):
                file_path = f"/Users/usuario1/Documents/{file_path}"
            
            # Créer le répertoire si nécessaire
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            # Écrire le fichier
            if Path(file_path).suffix.lower() in ['.xlsx', '.xls']:
                df.to_excel(file_path, sheet_name=sheet_name, index=False)
            elif Path(file_path).suffix.lower() == '.csv':
                df.to_csv(file_path, index=False)
            
            result = {
                "file_path": file_path,
                "rows_written": len(df),
                "columns_written": len(df.columns),
                "column_names": list(df.columns)
            }
            
            return [TextContent(
                type="text",
                text=f"✅ Fichier Excel créé avec succès :\n\n{json.dumps(result, indent=2, ensure_ascii=False)}"
            )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Erreur lors de l'écriture : {str(e)}"
            )]
    
    elif name == "read_excel":
        file_path = arguments["file_path"]
        sheet_name = arguments.get("sheet_name", 0)
        max_rows = arguments.get("max_rows", 100)
        
        try:
            if not Path(file_path).exists():
                return [TextContent(
                    type="text",
                    text=f"❌ Erreur : Le fichier '{file_path}' n'existe pas."
                )]
            
            # Lire le fichier selon son extension
            file_ext = Path(file_path).suffix.lower()
            
            if file_ext in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path, sheet_name=sheet_name, nrows=max_rows)
            elif file_ext == '.csv':
                df = pd.read_csv(file_path, nrows=max_rows)
            else:
                return [TextContent(
                    type="text",
                    text="❌ Erreur : Format de fichier non supporté"
                )]
            
            result = {
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "data": df.head(10).to_dict("records")
            }
            
            return [TextContent(
                type="text",
                text=f"✅ Fichier Excel lu avec succès :\n\n{json.dumps(result, indent=2, ensure_ascii=False)}"
            )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Erreur lors de la lecture : {str(e)}"
            )]
    
    elif name == "test_simple":
        message = arguments.get("message", "Test par défaut")
        
        return [TextContent(
            type="text",
            text=f"✅ Test réussi ! Message reçu : {message}\n📊 Serveur AI-Sheets connecté et fonctionnel !"
        )]
    
    else:
        return [TextContent(
            type="text",
            text=f"❌ Outil inconnu: {name}"
        )]

async def main():
    """Fonction principale"""
    # Configuration des options du serveur
    options = InitializationOptions(
        server_name="AI-Sheets",
        server_version="1.0.0",
        capabilities=server.get_capabilities(
            notification_options=NotificationOptions(),
            experimental_capabilities={}
        )
    )
    
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            options
        )

if __name__ == "__main__":
    asyncio.run(main())

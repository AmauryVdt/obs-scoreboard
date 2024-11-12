obs = obslua

-- Chemins des fichiers texte
local path_victoires_equipe1 = "C:/wt-esport-scoreboard/score1.txt"
local path_victoires_equipe2 = "C:/wt-esport-scoreboard/score2.txt"

-- Fonction pour lire le nombre de victoires depuis un fichier
local function lire_victoires(file_path)
    local file = io.open(file_path, "r")
    if file then
        local victoires = tonumber(file:read("*all"))
        file:close()
        return victoires or 0
    end
    return 0
end

-- Fonction pour mettre à jour l'affichage des carrés
local function mettre_a_jour_carres()
    -- Lire les victoires des deux équipes
    local victoires_equipe1 = lire_victoires(path_victoires_equipe1)
    local victoires_equipe2 = lire_victoires(path_victoires_equipe2)

    -- Mettre à jour l'opacité des carrés de l'équipe 1
    for i = 1, 5 do
        local source_name = "Team1_Match" .. i
        local visible = (i <= victoires_equipe1)
        local source = obs.obs_get_source_by_name(source_name)
        if source then
            obs.obs_source_set_enabled(source, visible)
            obs.obs_source_release(source)
        end
    end

    -- Mettre à jour l'opacité des carrés de l'équipe 2
    for i = 1, 5 do
        local source_name = "Team2_Match" .. i
        local visible = (i <= victoires_equipe2)
        local source = obs.obs_get_source_by_name(source_name)
        if source then
            obs.obs_source_set_enabled(source, visible)
            obs.obs_source_release(source)
        end
    end
end

-- Fonction de mise à jour périodique
local function script_update()
    mettre_a_jour_carres()
end

-- Initialisation du script
function script_load(settings)
    obs.timer_add(script_update, 1000)  -- Vérifie toutes les secondes
end

function script_unload()
    obs.timer_remove(script_update)
end

-- Create tables for Future Automotive Management System (ISO 9001 Compliant)

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE NOT NULL,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Bus', 'MiniBus')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'retired')) NOT NULL,
    consumption DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workers table (ISO 9001 Personnel Management)
CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    specialite VARCHAR(100),
    bus_id INTEGER REFERENCES buses(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    date_embauche DATE,
    qualification VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions table (Regional Stock Management)
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- KSAR, TETOUAN
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fournisseurs table (ISO 9001 Supplier Management)
CREATE TABLE IF NOT EXISTS fournisseurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    statut VARCHAR(20) DEFAULT 'approuve' CHECK (statut IN ('approuve', 'en_attente', 'rejete')),
    note_qualite DECIMAL(3,2) DEFAULT 0.00 CHECK (note_qualite >= 0 AND note_qualite <= 5),
    certification_iso BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table (ISO 9001 Inventory Management)
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(255) NOT NULL,
    description TEXT,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    stock_min INTEGER NOT NULL CHECK (stock_min >= 0),
    stock_actuel INTEGER DEFAULT 0 CHECK (stock_actuel >= 0),
    stock_securite INTEGER DEFAULT 0 CHECK (stock_securite >= 0),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    categorie VARCHAR(100),
    unite_mesure VARCHAR(20) DEFAULT 'unité',
    date_derniere_entree DATE,
    controle_qualite BOOLEAN DEFAULT TRUE,
    is_batch_tracked BOOLEAN DEFAULT FALSE,
    expiry_tracking BOOLEAN DEFAULT FALSE,
    critical_part BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regional Stocks table (Regional Distribution)
CREATE TABLE IF NOT EXISTS regional_stocks (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id),
    region_id INTEGER REFERENCES regions(id),
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    min_quantity INTEGER DEFAULT 0 CHECK (min_quantity >= 0),
    max_quantity INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Movements table (Simple Tracking)
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id),
    region_id INTEGER REFERENCES regions(id),
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(20) CHECK (movement_type IN ('entry', 'exit', 'transfer')),
    reference VARCHAR(50), -- BE reference, maintenance ID
    reason TEXT,
    operator_id INTEGER REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus Parts Requirements table (ISO 9001 Maintenance Planning)
CREATE TABLE IF NOT EXISTS bus_parts_requirements (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id),
    article_id INTEGER REFERENCES articles(id),
    quantite_recommandee INTEGER NOT NULL CHECK (quantite_recommandee > 0),
    frequence_remplacement VARCHAR(50),
    criticite VARCHAR(20) DEFAULT 'normale' CHECK (criticite IN ('critique', 'majeure', 'mineure', 'normale')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demandes Achat table (ISO 9001 Purchase Process)
CREATE TABLE IF NOT EXISTS demandes_achat (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    date_demande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'dp_genere', 'approuve', 'rejete', 'traite')),
    demandeur VARCHAR(255) NOT NULL,
    service VARCHAR(100),
    worker_id INTEGER REFERENCES workers(id),
    bus_id INTEGER REFERENCES buses(id),
    description TEXT,
    articles JSONB,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('urgente', 'normale', 'basse')),
    auto_approve BOOLEAN DEFAULT TRUE,
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demandes Prix table (ISO 9001 Supplier Evaluation)
CREATE TABLE IF NOT EXISTS demandes_prix (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    demande_achat_id INTEGER REFERENCES demandes_achat(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_reponse TIMESTAMP,
    date_limite_reponse DATE,
    prix_total DECIMAL(10,2) CHECK (prix_total >= 0),
    statut VARCHAR(20) DEFAULT 'envoyee' CHECK (statut IN ('envoyee', 'reponse_recue', 'en_cours', 'convertie', 'rejete')),
    delai_livraison VARCHAR(50),
    conditions TEXT,
    pieces_jointes TEXT,
    evaluation_qualite DECIMAL(3,2) CHECK (evaluation_qualite >= 0 AND evaluation_qualite <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bons Commande table (ISO 9001 Purchase Orders)
CREATE TABLE IF NOT EXISTS bons_commande (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    demande_prix_id INTEGER REFERENCES demandes_prix(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    date_commande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'expedie', 'livre', 'annule')),
    montant_total DECIMAL(10,2) NOT NULL CHECK (montant_total >= 0),
    conditions_livraison TEXT,
    conditions_paiement TEXT,
    articles JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bons Entree table (ISO 9001 Receiving Process)
CREATE TABLE IF NOT EXISTS bons_entree (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    bon_commande_id INTEGER REFERENCES bons_commande(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    date_entree TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'controle_qualite', 'valide', 'rejete')),
    controle_qualite BOOLEAN DEFAULT FALSE,
    resultats_controle TEXT,
    recu_par VARCHAR(255),
    observation TEXT,
    articles_recus JSONB,
    non_conformites TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Transactions table (ISO 9001 Traceability)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id),
    type_transaction VARCHAR(20) NOT NULL CHECK (type_transaction IN ('entree', 'sortie', 'ajustement')),
    quantite INTEGER NOT NULL,
    reference_document VARCHAR(50),
    date_transaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operateur VARCHAR(255),
    motif TEXT,
    bon_entree_id INTEGER REFERENCES bons_entree(id),
    region_id INTEGER REFERENCES regions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance table (ISO 9001 Maintenance Management)
CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id),
    type VARCHAR(100) NOT NULL,
    description TEXT,
    scheduled_date DATE,
    completed_date DATE,
    statut VARCHAR(20) DEFAULT 'programme' CHECK (statut IN ('programme', 'en_cours', 'termine', 'annule')),
    priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'urgente', 'critique')),
    cout DECIMAL(10,2) DEFAULT 0,
    technician_id INTEGER REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Parts Usage table (Integration with Stock)
CREATE TABLE IF NOT EXISTS maintenance_parts_usage (
    id SERIAL PRIMARY KEY,
    maintenance_id INTEGER REFERENCES maintenance(id),
    article_id INTEGER REFERENCES articles(id),
    region_id INTEGER REFERENCES regions(id),
    quantity_used INTEGER NOT NULL CHECK (quantity_used > 0),
    technician_id INTEGER REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Logs table (ISO 9001 Process Control)
CREATE TABLE IF NOT EXISTS workflow_logs (
    id SERIAL PRIMARY KEY,
    type_action VARCHAR(50) NOT NULL,
    reference_document VARCHAR(50),
    table_concernee VARCHAR(50),
    id_concerne INTEGER,
    action VARCHAR(255) NOT NULL,
    operateur VARCHAR(255),
    date_action TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buses_bus_number ON buses(bus_number);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_workers_nom ON workers(nom);
CREATE INDEX IF NOT EXISTS idx_workers_bus_id ON workers(bus_id);
CREATE INDEX IF NOT EXISTS idx_fournisseurs_nom ON fournisseurs(nom);
CREATE INDEX IF NOT EXISTS idx_fournisseurs_statut ON fournisseurs(statut);
CREATE INDEX IF NOT EXISTS idx_articles_reference ON articles(reference);
CREATE INDEX IF NOT EXISTS idx_articles_fournisseur_id ON articles(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_articles_categorie ON articles(categorie);
CREATE INDEX IF NOT EXISTS idx_regional_stocks_article_region ON regional_stocks(article_id, region_id);
CREATE INDEX IF NOT EXISTS idx_regional_stocks_quantity ON regional_stocks(quantity);
CREATE INDEX IF NOT EXISTS idx_regional_stocks_min_quantity ON regional_stocks(min_quantity);
CREATE INDEX IF NOT EXISTS idx_stock_movements_article_region ON stock_movements(article_id, region_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_demandes_achat_reference ON demandes_achat(reference);
CREATE INDEX IF NOT EXISTS idx_demandes_achat_statut ON demandes_achat(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_achat_worker_id ON demandes_achat(worker_id);
CREATE INDEX IF NOT EXISTS idx_demandes_achat_bus_id ON demandes_achat(bus_id);
CREATE INDEX IF NOT EXISTS idx_demandes_prix_reference ON demandes_prix(reference);
CREATE INDEX IF NOT EXISTS idx_demandes_prix_statut ON demandes_prix(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_prix_demande_achat_id ON demandes_prix(demande_achat_id);
CREATE INDEX IF NOT EXISTS idx_bons_commande_reference ON bons_commande(reference);
CREATE INDEX IF NOT EXISTS idx_bons_commande_statut ON bons_commande(statut);
CREATE INDEX IF NOT EXISTS idx_bons_commande_demande_prix_id ON bons_commande(demande_prix_id);
CREATE INDEX IF NOT EXISTS idx_bons_entree_reference ON bons_entree(reference);
CREATE INDEX IF NOT EXISTS idx_bons_entree_statut ON bons_entree(statut);
CREATE INDEX IF NOT EXISTS idx_bons_entree_bon_commande_id ON bons_entree(bon_commande_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_article_id ON inventory_transactions(article_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type_transaction ON inventory_transactions(type_transaction);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_region_id ON inventory_transactions(region_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(date_transaction);
CREATE INDEX IF NOT EXISTS idx_maintenance_bus_id ON maintenance(bus_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_statut ON maintenance(statut);
CREATE INDEX IF NOT EXISTS idx_maintenance_technician_id ON maintenance(technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_parts_usage_maintenance_id ON maintenance_parts_usage(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_parts_usage_article_id ON maintenance_parts_usage(article_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_parts_usage_region_id ON maintenance_parts_usage(region_id);
CREATE INDEX IF NOT EXISTS idx_bus_parts_requirements_bus_id ON bus_parts_requirements(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_parts_requirements_article_id ON bus_parts_requirements(article_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_type_action ON workflow_logs(type_action);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_date_action ON workflow_logs(date_action);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON fournisseurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regional_stocks_updated_at BEFORE UPDATE ON regional_stocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandes_achat_updated_at BEFORE UPDATE ON demandes_achat
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandes_prix_updated_at BEFORE UPDATE ON demandes_prix
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bons_commande_updated_at BEFORE UPDATE ON bons_commande
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bons_entree_updated_at BEFORE UPDATE ON bons_entree
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ISO 9001 Workflow Automation Triggers

-- Trigger 1: DA → DP Auto-generation
CREATE OR REPLACE FUNCTION auto_generate_dp_from_da()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate DP if DA is approved and auto_approve is true
    IF NEW.statut = 'approuve' AND NEW.auto_approve = TRUE THEN
        -- Log workflow action
        INSERT INTO workflow_logs (type_action, reference_document, table_concernee, id_concerne, action, operateur, details)
        VALUES ('da_to_dp', NEW.reference, 'demandes_achat', NEW.id, 'Auto-generating DP from DA', 'system', 
                json_build_object('auto_approve', NEW.auto_approve, 'total', NEW.total));
        
        -- Update status to indicate DP generation
        NEW.statut = 'dp_genere';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_generate_dp_trigger AFTER UPDATE ON demandes_achat
    FOR EACH ROW EXECUTE FUNCTION auto_generate_dp_from_da();

-- Trigger 2: DP → BC Auto-conversion
CREATE OR REPLACE FUNCTION auto_convert_dp_to_bc()
RETURNS TRIGGER AS $$
BEGIN
    -- Convert DP to BC when DP status is 'reponse_recue' and has best price
    IF NEW.statut = 'reponse_recue' AND NEW.prix_total > 0 THEN
        -- Log workflow action
        INSERT INTO workflow_logs (type_action, reference_document, table_concernee, id_concerne, action, operateur, details)
        VALUES ('dp_to_bc', NEW.reference, 'demandes_prix', NEW.id, 'Auto-converting DP to BC', 'system',
                json_build_object('prix_total', NEW.prix_total, 'fournisseur_id', NEW.fournisseur_id));
        
        -- Update status to indicate conversion
        NEW.statut = 'convertie';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_convert_dp_trigger AFTER UPDATE ON demandes_prix
    FOR EACH ROW EXECUTE FUNCTION auto_convert_dp_to_bc();

-- Trigger 3: BC → BE Auto-creation
CREATE OR REPLACE FUNCTION auto_create_be_from_bc()
RETURNS TRIGGER AS $$
BEGIN
    -- Create BE when BC is delivered
    IF NEW.statut = 'livre' THEN
        -- Generate BE reference
        DECLARE
            be_ref TEXT;
        BEGIN
            be_ref := 'BE-' || to_char(NEW.date_livraison_reelle, 'YYYY') || '-' || 
                      LPAD(EXTRACT(MONTH FROM NEW.date_livraison_reelle)::text, 2, '0') || '-' ||
                      LPAD(nextval('bons_entree_id_seq')::text, 3, '0');
            
            -- Insert new BE
            INSERT INTO bons_entree (reference, bon_commande_id, fournisseur_id, statut, articles_recus)
            VALUES (be_ref, NEW.id, NEW.fournisseur_id, 'en_attente', NEW.articles);
            
            -- Log workflow action
            INSERT INTO workflow_logs (type_action, reference_document, table_concernee, id_concerne, action, operateur, details)
            VALUES ('bc_to_be', NEW.reference, 'bons_commande', NEW.id, 'Auto-creating BE from BC', 'system',
                    json_build_object('be_reference', be_ref, 'date_livraison', NEW.date_livraison_reelle));
        END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_create_be_trigger AFTER UPDATE ON bons_commande
    FOR EACH ROW EXECUTE FUNCTION auto_create_be_from_bc();

-- Trigger 4: BE → Inventory Auto-update
CREATE OR REPLACE FUNCTION auto_update_inventory_from_be()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory when BE is validated
    IF NEW.statut = 'valide' THEN
        DECLARE
            article_record JSONB;
            article_id INTEGER;
            quantite INTEGER;
            region_id INTEGER;
        BEGIN
            -- Process each received article
            FOR article_record IN SELECT * FROM jsonb_array_elements(NEW.articles_recus)
            LOOP
                article_id := (article_record->>'article_id')::INTEGER;
                quantite := (article_record->>'quantite')::INTEGER;
                
                -- Get region_id from article
                SELECT r.id INTO region_id 
                FROM articles a
                JOIN regional_stocks rs ON a.id = rs.article_id
                WHERE a.id = article_id;
                
                -- Update regional stock
                UPDATE regional_stocks 
                SET quantity = quantity + quantite,
                    last_updated = NEW.date_entree
                WHERE article_id = article_id AND region_id = region_id;
                
                -- Create inventory transaction
                INSERT INTO inventory_transactions (article_id, type_transaction, quantite, reference_document, bon_entree_id, region_id, operateur, motif)
                VALUES (article_id, 'entree', quantite, NEW.reference, NEW.id, region_id, NEW.recu_par, 'Reception from BC');
                
                -- Log workflow action
                INSERT INTO workflow_logs (type_action, reference_document, table_concernee, id_concerne, action, operateur, details)
                VALUES ('be_to_inventory', NEW.reference, 'bons_entree', NEW.id, 'Auto-updating inventory', 'system',
                        json_build_object('article_id', article_id, 'quantite', quantite, 'region_id', region_id));
            END LOOP;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_update_inventory_trigger AFTER UPDATE ON bons_entree
    FOR EACH ROW EXECUTE FUNCTION auto_update_inventory_from_be();

-- Trigger 5: Maintenance → Stock Auto-deduction
CREATE OR REPLACE FUNCTION auto_deduct_maintenance_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct stock when maintenance is completed
    IF NEW.statut = 'termine' THEN
        DECLARE
            usage_record JSONB;
            article_id INTEGER;
            quantite INTEGER;
            region_id INTEGER;
        BEGIN
            -- Process each used part
            FOR usage_record IN SELECT * FROM jsonb_array_elements(
                (SELECT parts_used FROM maintenance_parts_usage WHERE maintenance_id = NEW.id)
            )
            LOOP
                article_id := (usage_record->>'article_id')::INTEGER;
                quantite := (usage_record->>'quantite')::INTEGER;
                
                -- Get region_id from article
                SELECT r.id INTO region_id 
                FROM articles a
                JOIN regional_stocks rs ON a.id = rs.article_id
                WHERE a.id = article_id;
                
                -- Update regional stock
                UPDATE regional_stocks 
                SET quantity = quantity - quantite,
                    last_updated = NOW()
                WHERE article_id = article_id AND region_id = region_id;
                
                -- Create inventory transaction
                INSERT INTO inventory_transactions (article_id, type_transaction, quantite, reference_document, region_id, operateur, motif)
                VALUES (article_id, 'sortie', quantite, 'MAINT-' || NEW.id, region_id, NEW.technician_id, 'Maintenance usage');
                
                -- Log workflow action
                INSERT INTO workflow_logs (type_action, reference_document, table_concernee, id_concerne, action, operateur, details)
                VALUES ('maintenance_to_inventory', 'MAINT-' || NEW.id, 'maintenance', NEW.id, 'Auto-deducting stock', 'system',
                        json_build_object('article_id', article_id, 'quantite', quantite, 'region_id', region_id));
            END LOOP;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_deduct_maintenance_trigger AFTER UPDATE ON maintenance
    FOR EACH ROW EXECUTE FUNCTION auto_deduct_maintenance_stock();

-- Insert sample data for ISO 9001 demonstration
INSERT INTO buses (bus_number, license_plate, type, status, consumption) VALUES
('BUS-001', 'MAT-001', 'Bus', 'active', 25.5),
('BUS-002', 'MAT-002', 'MiniBus', 'active', 18.2),
('BUS-003', 'MAT-003', 'Bus', 'maintenance', 22.8)
ON CONFLICT (bus_number) DO NOTHING;

INSERT INTO workers (nom, prenom, telephone, email, specialite, bus_id, status, date_embauche, qualification) VALUES
('Benali', 'Ahmed', '0612345678', 'ahmed.benali@company.com', 'Mécanicien', 1, 'active', '2023-01-15', 'Technicien Supérieur'),
('Karim', 'Mohamed', '0623456789', 'mohamed.karim@company.com', 'Électricien', 2, 'active', '2023-02-20', 'Technicien'),
('Rachidi', 'Fatima', '0634567890', 'fatima.rachidi@company.com', 'Carrossier', 3, 'active', '2023-03-10', 'Spécialiste')
ON CONFLICT DO NOTHING;

INSERT INTO regions (name, code, description) VALUES
('KSAR', 'KSAR', 'Région de KSAR - Centre principal'),
('TETOUAN', 'TETOUAN', 'Région de Tétouan - Opérations nord')
ON CONFLICT (name) DO NOTHING;

INSERT INTO fournisseurs (nom, adresse, telephone, email, statut, note_qualite, certification_iso) VALUES
('AutoParts Supplier', '123 Rue des Pièces, Casablanca', '0522123456', 'contact@autoparts.ma', 'approuve', 4.5, TRUE),
('Transport Equipment Ltd', '456 Avenue des Véhicules, Rabat', '0537789012', 'info@transport-equip.ma', 'approuve', 4.2, TRUE),
('MecaPro Services', '789 Boulevard Industriel, Casablanca', '0523345678', 'contact@mecapro.ma', 'approuve', 3.8, FALSE)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO articles (reference, designation, description, prix_unitaire, stock_min, stock_actuel, stock_securite, fournisseur_id, categorie, unite_mesure, controle_qualite, is_batch_tracked, expiry_tracking, critical_part) VALUES
('ART-001', 'Huile Moteur 5W30', 'Huile synthétique pour moteurs diesel', 150.00, 10, 25, 5, 1, 'Lubrifiants', 'Litre', TRUE, TRUE, TRUE),
('ART-002', 'Filtre à Air', 'Filtre à air pour bus standards', 45.50, 15, 30, 8, 1, 'Filtration', 'Unité', TRUE, FALSE, TRUE),
('ART-003', 'Pneu 315/80R22.5', 'Pneu radial pour bus', 850.00, 5, 12, 3, 2, 'Pneumatiques', 'Unité', TRUE, TRUE, TRUE),
('ART-004', 'Frein à Disque', 'Kit frein à disque avant', 320.00, 8, 15, 4, 1, 'Freinage', 'Kit', TRUE, FALSE, TRUE),
('ART-005', 'Batterie 12V 100Ah', 'Batterie pour bus', 450.00, 3, 8, 2, 2, 'Électrique', 'Unité', TRUE, TRUE, TRUE),
('ART-006', 'Essuie-glace', 'Balai essuie-glace standard', 25.00, 20, 40, 10, 1, 'Accessoires', 'Unité', FALSE, FALSE, FALSE),
('ART-007', 'Ampoule Phare', 'Ampoule LED phare principal', 35.00, 15, 30, 8, 2, 'Éclairage', 'Unité', FALSE, FALSE, FALSE),
('ART-008', 'Courroie Alternateur', 'Courroie d''alternateur standard', 85.00, 5, 10, 3, 1, 'Moteur', 'Unité', TRUE, FALSE, TRUE)
ON CONFLICT (reference) DO UPDATE SET
  designation = EXCLUDED.designation,
  description = EXCLUDED.description,
  prix_unitaire = EXCLUDED.prix_unitaire,
  stock_min = EXCLUDED.stock_min,
  stock_actuel = EXCLUDED.stock_actuel,
  stock_securite = EXCLUDED.stock_securite,
  fournisseur_id = EXCLUDED.fournisseur_id,
  categorie = EXCLUDED.categorie,
  unite_mesure = EXCLUDED.unite_mesure,
  controle_qualite = EXCLUDED.controle_qualite,
  is_batch_tracked = EXCLUDED.is_batch_tracked,
  expiry_tracking = EXCLUDED.expiry_tracking,
  critical_part = EXCLUDED.critical_part;

-- Insert regional stocks for KSAR and TETOUAN
INSERT INTO regional_stocks (article_id, region_id, quantity, min_quantity, max_quantity) VALUES
-- KSAR Region stocks
(1, 1, 15, 10, 30),  -- Huile Moteur
(2, 1, 20, 15, 40),  -- Filtre à Air
(3, 1, 8, 5, 20),    -- Pneu
(4, 1, 10, 8, 25),   -- Frein à Disque
(5, 1, 5, 3, 15),    -- Batterie
(6, 1, 25, 20, 50),  -- Essuie-glace
(7, 1, 18, 15, 35),  -- Ampoule Phare
(8, 1, 7, 5, 20),    -- Courroie Alternateur
-- TETOUAN Region stocks
(1, 2, 10, 10, 25),  -- Huile Moteur
(2, 2, 10, 15, 30),  -- Filtre à Air
(3, 2, 4, 5, 15),    -- Pneu
(4, 2, 5, 8, 20),    -- Frein à Disque
(5, 2, 3, 3, 10),    -- Batterie
(6, 2, 15, 20, 40),  -- Essuie-glace
(7, 2, 12, 15, 30),  -- Ampoule Phare
(8, 2, 3, 5, 15)     -- Courroie Alternateur
ON CONFLICT (article_id, region_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  min_quantity = EXCLUDED.min_quantity,
  max_quantity = EXCLUDED.max_quantity,
  last_updated = NOW();

INSERT INTO bus_parts_requirements (bus_id, article_id, quantite_recommandee, frequence_remplacement, criticite) VALUES
(1, 1, 20, 'mensuelle', 'critique'),
(1, 2, 2, 'trimestrielle', 'majeure'),
(1, 3, 6, 'annuelle', 'critique'),
(1, 4, 1, 'semestrielle', 'critique'),
(1, 5, 1, 'annuelle', 'majeure'),
(2, 1, 15, 'mensuelle', 'critique'),
(2, 2, 1, 'trimestrielle', 'majeure'),
(2, 3, 4, 'annuelle', 'critique'),
(2, 4, 1, 'semestrielle', 'critique'),
(2, 5, 1, 'annuelle', 'majeure'),
(3, 1, 20, 'mensuelle', 'critique'),
(3, 2, 2, 'trimestrielle', 'majeure'),
(3, 3, 6, 'annuelle', 'critique'),
(3, 4, 1, 'semestrielle', 'critique'),
(3, 5, 1, 'annuelle', 'majeure')
ON CONFLICT (bus_id, article_id) DO UPDATE SET
  quantite_recommandee = EXCLUDED.quantite_recommandee,
  frequence_remplacement = EXCLUDED.frequence_remplacement,
  criticite = EXCLUDED.criticite;

-- Insert sample maintenance records
INSERT INTO maintenance (bus_id, type, description, scheduled_date, statut, priorite, cout, technician_id) VALUES
(1, 'Maintenance Préventive', 'Vérification complète des systèmes', '2024-02-15', 'programme', 'normale', 0, 1),
(2, 'Réparation Freinage', 'Remplacement plaquettes de frein', '2024-02-10', 'en_cours', 'urgente', 320.00, 2),
(3, 'Maintenance Moteur', 'Changement huile et filtres', '2024-02-20', 'programme', 'normale', 150.00, 3)
ON CONFLICT (id) DO UPDATE SET
  bus_id = EXCLUDED.bus_id,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  scheduled_date = EXCLUDED.scheduled_date,
  statut = EXCLUDED.statut,
  priorite = EXCLUDED.priorite,
  cout = EXCLUDED.cout,
  technician_id = EXCLUDED.technician_id,
  updated_at = NOW();

-- Grant permissions (adjust as needed for your setup)
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Enable RLS (Row Level Security) - ISO 9001 compliance
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_parts_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_achat ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_prix ENABLE ROW LEVEL SECURITY;
ALTER TABLE bons_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE bons_entree ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_parts_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (basic policies - adjust as needed)
CREATE POLICY "Allow all operations on buses" ON buses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on workers" ON workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on regions" ON regions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fournisseurs" ON fournisseurs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on regional_stocks" ON regional_stocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on stock_movements" ON stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bus_parts_requirements" ON bus_parts_requirements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on demandes_achat" ON demandes_achat FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on demandes_prix" ON demandes_prix FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bons_commande" ON bons_commande FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bons_entree" ON bons_entree FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on inventory_transactions" ON inventory_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on maintenance" ON maintenance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on maintenance_parts_usage" ON maintenance_parts_usage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on workflow_logs" ON workflow_logs FOR ALL USING (true) WITH CHECK (true);

COMMIT;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON fournisseurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandes_achat_updated_at BEFORE UPDATE ON demandes_achat
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO buses (bus_number, license_plate, type, status, consumption) VALUES
('BUS-001', 'MAT-001', 'Bus', 'active', 25.5),
('BUS-002', 'MAT-002', 'MiniBus', 'active', 18.2),
('BUS-003', 'MAT-003', 'Bus', 'maintenance', 22.8)
ON CONFLICT (bus_number) DO NOTHING;

INSERT INTO fournisseurs (nom, adresse, telephone, email) VALUES
('AutoParts Supplier', '123 Rue des Pièces, Casablanca', '0522123456', 'contact@autoparts.ma'),
('Transport Equipment Ltd', '456 Avenue des Véhicules, Rabat', '0537789012', 'info@transport-equip.ma')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO articles (reference, designation, description, prix_unitaire, stock_min, stock_actuel, fournisseur_id) VALUES
('ART-001', 'Huile Moteur', 'Huile synthétique pour moteurs diesel', 150.00, 10, 25, 1),
('ART-002', 'Filtre à Air', 'Filtre à air pour bus', 45.50, 15, 30, 1),
('ART-003', 'Pneu 315/80R22.5', 'Pneu pour bus', 850.00, 5, 12, 2)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO demandes_achat (reference, statut, demandeur, articles, total) VALUES
('DA-001', 'en_attente', 'Admin', '[{"article_id": 1, "quantite": 5, "prix_unitaire": 150.00}, {"article_id": 2, "quantite": 10, "prix_unitaire": 45.50}]', 1205.00)
ON CONFLICT (reference) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- These are basic permissions - you may want to adjust based on your security requirements
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_achat ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (basic policies - adjust as needed)
CREATE POLICY "Allow all operations on buses" ON buses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fournisseurs" ON fournisseurs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on demandes_achat" ON demandes_achat FOR ALL USING (true) WITH CHECK (true);

COMMIT;

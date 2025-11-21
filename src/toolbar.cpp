//-----------------------------------------------------------------------------
// The toolbar that appears at the top left of the graphics window, where the
// user can select icons with the mouse, to perform operations equivalent to
// selecting a menu item or using a keyboard shortcut.
//
// Copyright 2008-2013 Jonathan Westhues.
//-----------------------------------------------------------------------------
#include "solvespace.h"

struct ToolIcon {
    std::string name;
    Command command;
    const char *tooltip;
    std::shared_ptr<Pixmap> pixmap;
};
static ToolIcon Toolbar[] = {
    {"line", Command::LINE_SEGMENT, N_("Sketch line segment"), {}},
    {"rectangle", Command::RECTANGLE, N_("Sketch rectangle"), {}},
    {"circle", Command::CIRCLE, N_("Sketch circle"), {}},
    {"arc", Command::ARC, N_("Sketch arc of a circle"), {}},
    {"text", Command::TTF_TEXT, N_("Sketch curves from text in a TrueType font"), {}},
    {"image", Command::IMAGE, N_("Sketch image from a file"), {}},
    {"tangent-arc", Command::TANGENT_ARC, N_("Create tangent arc at selected point"), {}},
    {"bezier", Command::CUBIC, N_("Sketch cubic Bezier spline"), {}},
    {"point", Command::DATUM_POINT, N_("Sketch datum point"), {}},
    {"construction", Command::CONSTRUCTION, N_("Toggle construction"), {}},
    {"trim", Command::SPLIT_CURVES, N_("Split lines / curves where they intersect"), {}},
    {"", Command::NONE, "", {}},

    {"length", Command::DISTANCE_DIA, N_("Constrain distance / diameter / length"), {}},
    {"angle", Command::ANGLE, N_("Constrain angle"), {}},
    {"horiz", Command::HORIZONTAL, N_("Constrain to be horizontal"), {}},
    {"vert", Command::VERTICAL, N_("Constrain to be vertical"), {}},
    {"parallel", Command::PARALLEL, N_("Constrain to be parallel or tangent"), {}},
    {"perpendicular", Command::PERPENDICULAR, N_("Constrain to be perpendicular"), {}},
    {"pointonx", Command::ON_ENTITY, N_("Constrain point on line / curve / plane / point"), {}},
    {"symmetric", Command::SYMMETRIC, N_("Constrain symmetric"), {}},
    {"equal", Command::EQUAL, N_("Constrain equal length / radius / angle"), {}},
    {"same-orientation", Command::ORIENTED_SAME, N_("Constrain normals in same orientation"), {}},
    {"other-supp", Command::OTHER_ANGLE, N_("Other supplementary angle"), {}},
    {"ref", Command::REFERENCE, N_("Toggle reference dimension"), {}},
    {"", Command::NONE, "", {}},

    {"extrude", Command::GROUP_EXTRUDE, N_("New group extruding active sketch"), {}},
    {"lathe", Command::GROUP_LATHE, N_("New group rotating active sketch"), {}},
    {"helix", Command::GROUP_HELIX, N_("New group helix from active sketch"), {}},
    {"revolve", Command::GROUP_REVOLVE, N_("New group revolve active sketch"), {}},
    {"step-rotate", Command::GROUP_ROT, N_("New group step and repeat rotating"), {}},
    {"step-translate", Command::GROUP_TRANS, N_("New group step and repeat translating"), {}},
    {"sketch-in-plane",
     Command::GROUP_WRKPL,
     N_("New group in new workplane (thru given entities)"),
     {}},
    {"sketch-in-3d", Command::GROUP_3D, N_("New group in 3d"), {}},
    {"assemble", Command::GROUP_LINK, N_("New group linking / assembling file"), {}},
    {"", Command::NONE, "", {}},

    {"in3d", Command::NEAREST_ISO, N_("Nearest isometric view"), {}},
    {"ontoworkplane", Command::ONTO_WORKPLANE, N_("Align view to active workplane"), {}},
};

void GraphicsWindow::ToolbarDraw(UiCanvas *canvas) {
    ToolbarDrawOrHitTest(0, 0, canvas, NULL, NULL, NULL);
}

bool GraphicsWindow::ToolbarMouseMoved(int x, int y) {
    double width, height;
    window->GetContentSize(&width, &height);

    x += ((int)width / 2);
    y += ((int)height / 2);

    Command hitCommand;
    int hitX, hitY;
    bool withinToolbar = ToolbarDrawOrHitTest(x, y, NULL, &hitCommand, &hitX, &hitY);

    if(hitCommand != toolbarHovered) {
        toolbarHovered = hitCommand;
        Invalidate();
    }

    if(toolbarHovered != Command::NONE) {
        std::string tooltip;
        for(ToolIcon &icon : Toolbar) {
            if(toolbarHovered == icon.command) {
                tooltip = Translate(icon.tooltip);
            }
        }

        Platform::KeyboardEvent accel = SS.GW.AcceleratorForCommand(toolbarHovered);
        std::string accelDesc         = Platform::AcceleratorDescription(accel);
        if(!accelDesc.empty()) {
            tooltip += ssprintf(" (%s)", accelDesc.c_str());
        }

        window->SetTooltip(tooltip, hitX, hitY, 32, 32);
    } else {
        window->SetTooltip("", 0, 0, 0, 0);
    }

    if(SS.GW.toolbarDragging) {
        SS.GW.toolbarX = x - SS.GW.toolbarDragOffsetX;
        SS.GW.toolbarY = y - SS.GW.toolbarDragOffsetY;
        Invalidate();
        return true;
    }

    return withinToolbar;
}

bool GraphicsWindow::ToolbarMouseDown(int x, int y) {
    double width, height;
    window->GetContentSize(&width, &height);

    x += ((int)width / 2);
    y += ((int)height / 2);

    Command hitCommand;
    bool withinToolbar = ToolbarDrawOrHitTest(x, y, NULL, &hitCommand, NULL, NULL);
    if(withinToolbar && hitCommand == Command::NONE) {
        SS.GW.toolbarDragging    = true;
        SS.GW.toolbarDragOffsetX = x - SS.GW.toolbarX;
        SS.GW.toolbarDragOffsetY =
            y - SS.GW.toolbarY; // Note: Y might need inversion check depending on coord system
    }
    if(hitCommand != Command::NONE) {
        SS.GW.ActivateCommand(hitCommand);
    }
    return withinToolbar;
}

bool GraphicsWindow::ToolbarDrawOrHitTest(int mx, int my, UiCanvas *canvas, Command *hitCommand,
                                          int *hitX, int *hitY) {
    double width, height;
    window->GetContentSize(&width, &height);

    int x = SS.GW.toolbarX + 17, y = (int)(height - 21); // 20 is the menu bar height

    // When changing these values, also change the asReference drawing code in drawentity.cpp
    // as well as the "window->SetMinContentSize(720, 636);" in graphicswin.cpp
    int fudge = 8;
    int h     = 32 * 18 + 3 * 16 +
            fudge; // Toolbar height = 18 icons * 32 pixels + 3 dividers * 16 pixels + fudge

    if(h < y) {
        // If there is enough vertical space leave up to 32 pixels between the menu bar and the
        // toolbar.
        y -= ((y - h) < 32) ? y - h : 32;
    }

    int aleft = SS.GW.toolbarX, aright = SS.GW.toolbarX + 68,
        atop = y + 16 + fudge / 2 - SS.GW.toolbarY, abot = y + 16 - h + SS.GW.toolbarY;

    bool withinToolbar = (mx >= aleft && mx <= aright && my <= atop && my >= abot);

    // Initialize/clear hitCommand.
    if(hitCommand)
        *hitCommand = Command::NONE;

    if(!canvas && !withinToolbar) {
        // This gets called every MouseMove event, so return quickly.
        return false;
    }

    if(canvas) {
        // Draw toolbar background matching Figma design
        canvas->DrawRect(aleft, aright, atop, abot,
                         /*fillColor=*/{244, 246, 247, 255},
                         /*outlineColor=*/{});
    }

    bool leftpos = true;
    for(ToolIcon &icon : Toolbar) {
        if(icon.name.empty()) { // spacer
            if(!leftpos) {
                leftpos = true;
                y -= 32;
                x -= 32;
            }
            y -= 16;

            if(canvas) {
                // Draw a separator bar matching Figma design (subtle, thin divider)
                int divw = 30, divh = 1;
                canvas->DrawRect(x + 16 + divw, x + 16 - divw, y + 24 + divh, y + 24 - divh,
                                 /*fillColor=*/{149, 183, 208, 41}, // rgba(149,183,208,0.16)
                                 /*outlineColor=*/{});
            }

            continue;
        }

        if(icon.pixmap == nullptr) {
            icon.pixmap = LoadPng("icons/graphics-window/" + icon.name + ".png");
        }

        if(canvas) {
            // Draw button background and border based on state
            const int boxhw = 15;

            if(pending.operation == Pending::COMMAND && pending.command == icon.command) {
                // Selected/active state: blue border and light blue background
                canvas->DrawRect(x + boxhw, x - boxhw, y + boxhw, y - boxhw,
                                 /*fillColor=*/{255, 255, 255, 0}, // Transparent fill
                                 /*outlineColor=*/{27, 93, 141, 255}); // Blue border
            } else if(toolbarHovered == icon.command) {
                // Hover state: light gray background
                canvas->DrawRect(x + boxhw, x - boxhw, y + boxhw, y - boxhw,
                                 /*fillColor=*/{0, 0, 0, 15}, // Very light gray overlay
                                 /*outlineColor=*/{});
            }

            canvas->DrawPixmap(icon.pixmap, x - (int)icon.pixmap->width / 2,
                               y - (int)icon.pixmap->height / 2);
        } else {
            const int boxhw = 16;
            if(mx < (x + boxhw) && mx > (x - boxhw) && my < (y + boxhw) && my > (y - boxhw)) {
                if(hitCommand)
                    *hitCommand = icon.command;
                if(hitX)
                    *hitX = x - boxhw;
                if(hitY)
                    *hitY = (int)height - (y + boxhw);
            }
        }

        if(leftpos) {
            x += 32;
            leftpos = false;
        } else {
            x -= 32;
            y -= 32;
            leftpos = true;
        }
    }

    return withinToolbar;
}

void GraphicsWindow::ToolbarMouseUp() {
    SS.GW.toolbarDragging = false;
}

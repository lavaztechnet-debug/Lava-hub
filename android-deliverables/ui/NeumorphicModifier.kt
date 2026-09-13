package com.example.neoai.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

val NeoBackground = Color(0xFFE0E5EC)
val NeoShadowLight = Color(0xFFFFFFFF)
val NeoShadowDark = Color(0xFFA3B1C6)

/**
 * Custom Modifier for 3D-Depth Neumorphism (Soft UI)
 * Creates light/dark shadow offsets and supports 'pressed' state inner-shadow logic.
 */
fun Modifier.neumorphic(
    cornerRadius: Dp = 12.dp,
    shadowRadius: Dp = 8.dp,
    offsetX: Dp = 6.dp,
    offsetY: Dp = 6.dp,
    isPressed: Boolean = false
) = composed {
    val lightShadow = NeoShadowLight
    val darkShadow = NeoShadowDark
    
    this.drawBehind {
        val cornerRadiusPx = cornerRadius.toPx()
        val shadowRadiusPx = shadowRadius.toPx()
        val offsetXPx = offsetX.toPx()
        val offsetYPx = offsetY.toPx()

        drawIntoCanvas { canvas ->
            val paint = Paint()
            val frameworkPaint = paint.asFrameworkPaint()
            frameworkPaint.isAntiAlias = true

            if (!isPressed) {
                // Drop Shadow (Convex / Out)
                frameworkPaint.color = Color.Transparent.toArgb()

                // Light Shadow (Top-Left)
                frameworkPaint.setShadowLayer(
                    shadowRadiusPx,
                    -offsetXPx,
                    -offsetYPx,
                    lightShadow.toArgb()
                )
                canvas.drawRoundRect(
                    0f, 0f, size.width, size.height,
                    cornerRadiusPx, cornerRadiusPx, paint
                )

                // Dark Shadow (Bottom-Right)
                frameworkPaint.setShadowLayer(
                    shadowRadiusPx,
                    offsetXPx,
                    offsetYPx,
                    darkShadow.copy(alpha = 0.6f).toArgb()
                )
                canvas.drawRoundRect(
                    0f, 0f, size.width, size.height,
                    cornerRadiusPx, cornerRadiusPx, paint
                )
            } else {
                // Inner Shadow (Concave / Pressed) 
                // A true inner shadow requires clipping or masking in Compose Canvas.
                // For a simpler pressed simulation, we reverse the shadow directions and color,
                // drawing over the edges.
                frameworkPaint.color = Color.Transparent.toArgb()
                
                frameworkPaint.setShadowLayer(
                    shadowRadiusPx,
                    offsetXPx / 2,
                    offsetYPx / 2,
                    darkShadow.copy(alpha = 0.7f).toArgb()
                )
                canvas.drawRoundRect(
                    0f, 0f, size.width, size.height,
                    cornerRadiusPx, cornerRadiusPx, paint
                )
            }
        }
    }.background(NeoBackground, RoundedCornerShape(cornerRadius))
}

@Composable
fun Modifier.neumorphicClickable(
    onClick: () -> Unit,
    cornerRadius: Dp = 12.dp,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }
): Modifier {
    val isPressed by interactionSource.collectIsPressedAsState()
    
    return this
        .neumorphic(cornerRadius = cornerRadius, isPressed = isPressed)
        .padding(2.dp) // Provide spacing so shadow isn't clipped
        .background(NeoBackground, RoundedCornerShape(cornerRadius))
}

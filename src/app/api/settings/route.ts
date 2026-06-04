import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings?group=xxx - Get site settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    const where: Record<string, unknown> = {}

    if (group) {
      where.group = group
    }
    if (key) {
      where.key = key
    }

    const settings = await db.siteSetting.findMany({ where })

    // If fetching a single key
    if (key) {
      const setting = settings[0]
      if (!setting) {
        return NextResponse.json(
          { error: 'Setting not found' },
          { status: 404 }
        )
      }
      // Parse value based on type
      let value: unknown = setting.value
      if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value)
        } catch {
          value = setting.value
        }
      } else if (setting.type === 'number') {
        value = Number(setting.value)
      } else if (setting.type === 'boolean') {
        value = setting.value === 'true'
      }

      return NextResponse.json({
        setting: { ...setting, parsedValue: value },
      })
    }

    // Group settings
    const grouped: Record<string, Record<string, unknown>> = {}
    for (const setting of settings) {
      if (!grouped[setting.group]) {
        grouped[setting.group] = {}
      }

      let value: unknown = setting.value
      if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value)
        } catch {
          value = setting.value
        }
      } else if (setting.type === 'number') {
        value = Number(setting.value)
      } else if (setting.type === 'boolean') {
        value = setting.value === 'true'
      }

      grouped[setting.group][setting.key] = {
        value,
        label: setting.label,
        type: setting.type,
      }
    }

    return NextResponse.json({ settings: grouped })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PATCH /api/settings - Update site settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body as {
      settings: Array<{
        key: string
        value: string
        group?: string
        label?: string
        type?: string
      }>
    }

    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json(
        { error: 'settings array is required' },
        { status: 400 }
      )
    }

    const results = []

    for (const setting of settings) {
      if (!setting.key) continue

      // Upsert the setting
      const result = await db.siteSetting.upsert({
        where: { key: setting.key },
        create: {
          key: setting.key,
          value: String(setting.value),
          group: setting.group || 'general',
          label: setting.label || null,
          type: setting.type || 'text',
        },
        update: {
          value: String(setting.value),
          ...(setting.group ? { group: setting.group } : {}),
          ...(setting.label ? { label: setting.label } : {}),
          ...(setting.type ? { type: setting.type } : {}),
        },
      })

      results.push(result)
    }

    return NextResponse.json({ updated: results.length, settings: results })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
